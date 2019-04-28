import { distanceInWordsToNow } from 'date-fns';
import pt from 'date-fns/locale/pt';
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { MdInsertDriveFile } from 'react-icons/md';
import socket from 'socket.io-client';
import logo from '../../assets/logo.svg';
import API, { API_URL } from '../../services/api';
import './styles.css';


export default class Box extends Component {
  state = { box: {} };

  async componentDidMount() {
    const { match: { params: { id } } } = this.props;
    const response = await API.get(`/boxes/${id}`);
    if (response.status !== 200) return null;
    this.setState({ box: response.data });
    return this.subscribeToNewFiles();
  }

  subscribeToNewFiles = () => {
    const io = socket(API_URL);
    const { box } = this.state;
    io.emit('connectRoom', box._id);
    io.on('file', file => this.setState({ box: { ...box, files: [file, ...box.files] } }));
  }

  renderDistanceTime = date => (
    <span>{distanceInWordsToNow(date, { locale: pt, includeSeconds: true, addSuffix: true })}</span>
  )

  renderFile = file => (
    <li key={file._id}>
      <a className="fileInfo" href={file.url} target="_blank">
        <MdInsertDriveFile size={24} color="#A5Cfff" />
        <strong>{file.title}</strong>
      </a>
      {file.createdAt && this.renderDistanceTime(file.createdAt)}
    </li>
  );

  handleUpload = files => files.forEach((file) => {
    const data = new FormData();

    data.append('file', file);
    API.post(`boxes/${this.state.box._id}/files`, data);
  });

  renderDropzone = ({ getRootProps, getInputProps }) => (
    <div className="upload" {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Arraste arquivos ou clique aqui!</p>
    </div>
  );

  render() {
    const { box } = this.state;
    return (
      <div className="box-container">
        <header>
          <img src={logo} alt="" />
          <h1>{box.title}</h1>
        </header>

        <Dropzone onDropAccepted={this.handleUpload}>{this.renderDropzone}</Dropzone>

        <ul>
          {box.files && box.files.map(this.renderFile)}
        </ul>
      </div>
    );
  }
}
