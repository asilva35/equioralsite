import React, { useEffect, useState } from 'react';
import ModalComponent from '@/components/ModalComponent/ModalComponent';
import { toast } from 'react-toastify';
import styles from './MediaUpload.module.css';

const sendImageToServer = async (file) => {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/media/upload`;
  const body = new FormData();
  body.append('file', file);
  return await fetch(url, {
    method: 'POST',
    body,
  });
};

export default function MediaUpload({ show, onSelect }) {
  const [showModal, setShowModal] = useState(0);
  const [allowSave, setAllowSave] = useState(false);
  const [savingMedia, setSavingMedia] = useState(false);
  const [file, setFile] = useState();
  const [label, setLabel] = useState('Choose a file');
  // const onSaveMedia = async () => {
  //   const resp = await sendImageToServer(file);
  //   if (resp.ok) {
  //     const resp_json = await resp.json();
  //     if (resp_json.success) {
  //       return resp;
  //     } else {
  //       toast.error('Error saving image');
  //     }
  //   }
  // };
  const _onSelect = () => {
    onSelect(file);
    setFile(null);
    setShowModal(0);
    setAllowSave(true);
    setSavingMedia(false);
    setLabel('Choose a file');
  };
  const onChange = (e) => {
    setLabel(e.target.files[0].name);
    setFile(e.target.files[0]);
  };
  useEffect(() => {
    if (show > 0) setShowModal(show);
  }, [show]);

  useEffect(() => {
    if (file) {
      setAllowSave(true);
    }
  }, [file]);
  return (
    <ModalComponent
      show={showModal}
      onSave={_onSelect}
      title={'Elija una foto'}
      onCloseModal={() => {
        setAllowSave(false);
        setSavingMedia(false);
      }}
      allowSave={allowSave}
      savingRecord={savingMedia}
      size={'xl'}
      labelButtonSave="Seleccionar"
    >
      <div className={styles.Inputs}>
        <div className={styles.InputGroup}>
          <input
            type="file"
            id="file"
            onChange={onChange}
            className={styles.MediaUploadInput}
          />

          <label htmlFor="file" className={styles.MediaUploadInputLabel}>
            {label}
          </label>
        </div>
      </div>
    </ModalComponent>
  );
}
