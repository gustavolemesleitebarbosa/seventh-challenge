import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();
    data.append('file', uploadedFiles[0].file);
    data.append('name', uploadedFiles[0].name);
    data.append('readbleSize', uploadedFiles[0].readableSize);
    console.log('fucking file', data.get('file'));

    const dataArray = uploadedFiles.map(file => {
      const datan = new FormData();
      datan.append('file', file.file);
      datan.append('name', file.name);
      datan.append('readbleSize', file.readableSize);
      console.log('fucking file', datan.get('file'));
      return datan;
    });

    try {
      const asyncForEach = async function (
        array: string | any[],
        callback: (arg0: any, arg1: number, arg2: any) => any,
      ): Promise<void> {
        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < array.length; index++) {
          // eslint-disable-next-line no-await-in-loop
          await callback(array[index], index, array);
        }
      };

      asyncForEach(dataArray, async transaction => {
        await api.post('/transactions/import', transaction);
        console.log(transaction);
      });
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    const arrayOfFiles = files.map(file => {
      return {
        file,
        name: file.name,
        readableSize: `${file.size}`,
      };
    });
    setUploadedFiles(arrayOfFiles);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
