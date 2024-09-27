import ModalComponent from '@/components/ModalComponent/ModalComponent';
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from '@internationalized/date';
import { Button, DateInput, Input, Textarea } from '@nextui-org/react';
import { I18nProvider } from '@react-aria/i18n';
import { AddIcon, DeleteIcon } from '@virtel/icons';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './AddPost.module.css';

async function savePost(uid, title, description, date, photos) {
  let url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/posts/`;
  url += uid ? 'update' : 'new';
  const body = new FormData();
  body.append('_uid', uid);
  body.append('title', title);
  body.append('description', description);
  body.append('date', date);
  let count_photos = 0;
  photos.map((p) => {
    body.append(p.name, p.photo);
    count_photos++;
  });
  body.append('count_photos', count_photos);
  return await fetch(url, {
    method: 'POST',
    body,
  });
}

export default function AddPost({ postToEdit, onClose }) {
  const [showModal, setShowModal] = useState(0);
  const [allowSave, setAllowSave] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [uid, setUId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [photosPreview, setPhotosPreview] = useState([]);
  const [validation, setValidation] = useState({});
  const [date, setDate] = React.useState(
    parseAbsoluteToLocal(new Date().toISOString())
  );
  const onSavePost = async () => {
    setSavingPost(true);
    const date_str = !date ? '' : date.toDate(getLocalTimeZone()).toISOString();
    const resp = await savePost(uid, title, description, date_str, photos);
    if (resp.ok) {
      setShowModal(0);
      setTitle('');
      setDescription('');
      setSavingPost(false);
      toast.success('Servicio / Caso Publicado');
      location.reload();
    } else {
      toast.error('Ocurrio un problema intente nuevamente');
      setSavingPost(false);
      const resp_json = await resp.json();
      if (resp_json.validation) {
        setValidation(resp_json.validation);
      }
    }
  };
  useEffect(() => {
    if (title && description) {
      setAllowSave(true);
    } else {
      setAllowSave(false);
    }
  }, [title, description]);
  const onSelectPhoto = (e) => {
    const _photos = [...photos];
    _photos.push({
      name: `Photo-${_photos.length + 1}`,
      photo: e.target.files[0],
    });
    setPhotos(_photos);
    const preview = URL.createObjectURL(e.target.files[0]);
    setPhotosPreview((c) => [...c, preview]);
  };

  const getFileFromUrl = async (url) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/posts/getimage/?url=${url}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch image from ${url}`);
      }

      const blob = await response.blob();
      const filename = url.split('/').pop();
      const file = new File([blob], filename, { type: blob.type });

      return file;
    } catch (error) {
      console.error(`Error creating File object for ${url}:`, error);
    }
  };
  const populatePostToEdit = async () => {
    setTitle(postToEdit.Title);
    setDescription(postToEdit.Description);
    setDate(parseAbsoluteToLocal(postToEdit.Date));
    setUId(postToEdit._uid);
    const _photos = [];
    const previews = [];
    for (var i = 0; i < postToEdit.Photos.length; i++) {
      const photo = postToEdit.Photos[i];
      previews.push(photo.url);
      const file = await getFileFromUrl(photo.url);
      _photos.push({
        name: `Photo-${i + 1}`,
        photo: file,
      });
    }
    setPhotos(_photos);
    setPhotosPreview(previews);
    setShowModal((c) => c + 1);
  };

  useEffect(() => {
    if (postToEdit) {
      populatePostToEdit();
    }
  }, [postToEdit]);

  const onDeletePhoto = (i) => {
    const _photos = [...photos];
    const _photosPreview = [...photosPreview];
    _photos.splice(i, 1);
    _photosPreview.splice(i, 1);
    _photos.map((p, ii) => {
      p.name = `Photo-${ii + 1}`;
    });
    setPhotos(_photos);
    setPhotosPreview(_photosPreview);
  };

  return (
    <>
      <div className={styles.AddPostButton}>
        <Button isIconOnly onPress={() => setShowModal((c) => c + 1)}>
          <AddIcon fill={'#fff'} size={36} />
        </Button>
      </div>
      <ModalComponent
        show={showModal}
        onSave={onSavePost}
        title={'Publica un Servicio / Caso'}
        onCloseModal={() => {
          setTitle('');
          setDescription('');
          setSavingPost(false);
          setPhotos([]);
          setPhotosPreview([]);
          setUId('');
          if (onClose) onClose();
        }}
        allowSave={allowSave}
        savingRecord={savingPost}
        size={'xl'}
      >
        <div className={styles.Inputs}>
          <div className={styles.InputGroup}>
            <Input
              type="text"
              label="Titulo"
              onChange={(e) => setTitle(e.target.value)}
              defaultValue={title || ''}
              color={validation.title ? 'danger' : 'default'}
            />
            {validation.title && (
              <p className="text-danger">{validation.title}</p>
            )}
          </div>
          <div className={styles.InputGroup}>
            <Textarea
              label="Descripción"
              onChange={(e) => setDescription(e.target.value)}
              defaultValue={description || ''}
              color={validation.description ? 'danger' : 'default'}
            />
            {validation.description && (
              <p className="text-danger">{validation.description}</p>
            )}
          </div>
          <div className={styles.InputGroup}>
            <I18nProvider locale="es-CO">
              <DateInput
                label="Fecha de la Publicación"
                value={date}
                onChange={setDate}
                granularity="day"
                color={validation.date ? 'danger' : 'default'}
              />
            </I18nProvider>
            {validation.date && (
              <p className="text-danger">{validation.date}</p>
            )}
          </div>
          <div className={styles.InputGroup}>
            <input
              type="file"
              id="file"
              onChange={onSelectPhoto}
              className={styles.MediaUploadInput}
            />
            <div className={styles.PhotoPreviews}>
              {photosPreview.map((preview, i) => (
                <div className={styles.PhotoPreview} key={i}>
                  <DeleteIcon
                    className={styles.DeletePhoto}
                    onClick={() => onDeletePhoto(i)}
                    fill={'black'}
                    size={'12'}
                  />
                  <img src={preview} alt="" />
                </div>
              ))}
            </div>
            <label htmlFor="file" className={styles.MediaUploadInputLabel}>
              Agregar Foto
            </label>
            {validation.Photos && (
              <p className="text-danger">{validation.Photos}</p>
            )}
          </div>
        </div>
      </ModalComponent>
    </>
  );
}
