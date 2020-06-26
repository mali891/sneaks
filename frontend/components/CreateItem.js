import React, { Component, Fragment } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import { Error } from './';
import { Form } from './styles';
import { formatMoney } from '../lib';
import { CREATE_ITEM_MUTATION } from '../data';
import { API_URLS } from '../constants'

class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0
  };

  componentDidMount() {
    console.log(process.env.CLOUDINARY_KEY)
  }

  handleChange = ({ target: { name, type, value } }) => {
    let val = value;
    if (type === 'number') val = parseFloat(val);

    this.setState({ [name]: val });
  };

  uploadFile = async ({ target }) => {
    const files = target.files
    const data = new FormData()
    data.append('file', files[0]);
    data.append('upload_preset', 'sneaks')

    return await fetch(API_URLS.CLOUDINARY_UPLOAD, {
      method: 'POST',
      body: data
    }).then(res => {
      res.json().then(({ eager, secure_url }) => {
        this.setState({
          image: secure_url,
          largeImage: eager[0].secure_url,
        })
      })
    }).catch(err => new Error(err))
  }

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state} >
        {(createItem, { loading, error }) => (
          <Fragment>
            {error ? (
              <Error error={error} />
            ) : (
                <Form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const response = await createItem();
                    Router.push({
                      pathname: '/item',
                      query: { item: response.data.createItem.id }
                    });
                  }}
                >
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="file">
                      Upload image
										<input
                        type="file"
                        id="file"
                        name="file"
                        placeholder="Upload an image"
                        required
                        // value={this.state.image}
                        onChange={this.uploadFile}
                      />
                      {this.state.image && (
                        <Fragment>
                          <p>Preview: </p>
                          <img src={this.state.image} alt="upload preview" />
                        </Fragment>
                      )}
                    </label>

                    <label htmlFor="title">
                      Title
										<input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        value={this.state.title}
                        onChange={this.handleChange}
                      />
                    </label>

                    <label htmlFor="price">
                      Price
										<input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Price"
                        required
                        value={this.state.price}
                        onChange={this.handleChange}
                      />
                    </label>

                    <label htmlFor="description">
                      Description
										<textarea
                        type="text"
                        id="description"
                        name="description"
                        placeholder="Description"
                        required
                        value={this.state.description}
                        onChange={this.handleChange}
                      />
                    </label>
                    <button type="submit">Submit</button>
                  </fieldset>
                </Form>
              )}
          </Fragment>
        )
        }
      </Mutation>
    );
  }
}

export default CreateItem;
