import React from 'react';
import API from '../../services/api';
import logo from '../../assets/logo.svg';
import './styles.css';

export default class extends React.Component {
  state = {
    newBox: '',
  };

  handleSubmit = async (e) => {
    const { history } = this.props;
    e.preventDefault();
    const response = await API.post('/boxes', { title: this.state.newBox });
    if (response.status !== 200) return null;
    return history.push(`/box/${response.data._id}`);
  };

  handleInputChange = e => this.setState({ newBox: e.target.value });

  render() {
    return (
      <div className="main-container">
        <form onSubmit={this.handleSubmit}>
          <img src={logo} alt="" />
          <input
            placeholder="Criar um box"
            value={this.state.newBox}
            onChange={this.handleInputChange}
          />
          <button type="submit">CRIAR</button>
        </form>
      </div>
    );
  }
}
