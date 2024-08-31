import React, { useCallback, useEffect, useRef, useState } from 'react';

export const throttle = (f) => {
  let token = null,
    lastArgs = null;
  const invoke = () => {
    f(...lastArgs);
    token = null;
  };
  const result = (...args) => {
    lastArgs = args;
    if (!token) {
      token = requestAnimationFrame(invoke);
    }
  };
  result.cancel = () => token && cancelAnimationFrame(token);
  return result;
};

export const useDraggable = ({
  verticalDrag = true,
  horizontalDrag = true,
  pointHandle = false,
  translateElement = true,
} = {}) => {
  const onDrag = useCallback(
    ({
      x,
      y,
      cursorX,
      cursorY,
      offsetX,
      offsetY,
      offsetWidth,
      offsetHeight,
    }) => ({
      x: Math.max(0, x),
      y: Math.max(0, y),
      cursorX: Math.max(0, cursorX),
      cursorY: Math.max(0, cursorY),
      offsetX: Math.max(0, offsetX),
      offsetY: Math.max(0, offsetY),
      offsetWidth: Math.max(0, offsetWidth),
      offsetHeight: Math.max(0, offsetHeight),
    }),
    []
  );

  const [startDrag, setStartDrag] = useState(false);
  const [endDrag, setEndDrag] = useState(null);
  const [dragging, setDragging] = useState(0);

  const position = useRef({
    x: 0,
    y: 0,
    cursorX: 0,
    cursorY: 0,
    offsetX: 0,
    offsetY: 0,
    offsetWidth: 0,
    offsetHeight: 0,
  });
  const ref = useRef();
  const unsubscribe = useRef();
  const legacyRef = useCallback((elem) => {
    ref.current = elem;
    if (unsubscribe.current) {
      unsubscribe.current();
    }
    if (!elem) {
      return;
    }
    const handleMouseDown = (e) => {
      if (pointHandle && !e.target?.dataset?.handle) return;
      e.target.style.userSelect = 'none';
      position.current = {
        x: 0,
        y: 0,
        cursorX: e.clientX,
        cursorY: e.clientY,
        offsetX: e.target.offsetLeft,
        offsetY: e.target.offsetTop,
        offsetWidth: e.target.offsetWidth,
        offsetHeight: e.target.offsetHeight,
      };
      setStartDrag(true);
      setEndDrag(false);
    };
    elem.addEventListener('mousedown', handleMouseDown);
    unsubscribe.current = () => {
      elem.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  useEffect(() => {
    if (!startDrag) {
      return;
    }
    const handleMouseMove = throttle((event) => {
      if (!ref.current || !position.current) {
        return;
      }
      const pos = position.current;
      const elem = ref.current;
      const movementX = horizontalDrag ? event.movementX : 0;
      const movementY = verticalDrag ? event.movementY : 0;
      position.current = onDrag({
        x: pos.x + movementX,
        y: pos.y + movementY,
        cursorX: event.clientX,
        cursorY: event.clientY,
        offsetX: pos.offsetX + movementX,
        offsetY: pos.offsetY + movementY,
        offsetWidth: elem.offsetWidth,
        offsetHeight: elem.offsetHeight,
      });
      if (translateElement)
        elem.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      setDragging((prev) => prev + 1);
    });
    const handleMouseUp = (e) => {
      if (e.target.style) {
        e.target.style.userSelect = 'auto';
      }
      setStartDrag(false);
      setEndDrag(true);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      handleMouseMove.cancel();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [startDrag, onDrag]);

  return [legacyRef, startDrag, endDrag, dragging, position.current];
};
