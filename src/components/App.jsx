import React, { Component } from 'react';
import backend from '../helpers/pixabay-api';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import ImageGalleryItem from './ImageGalleryItem/ImageGalleryItem';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import css from './App.module.css';

class App extends Component {
  imagesPerPage = 12;

  state = {
    images: [],
    totalImages: 0,
    loading: false,
    error: null,
    searchQuery: '',
    page: 1,
    showModal: false,
    largeImageURL: '',
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.searchQuery !== this.state.searchQuery ||
      prevState.page !== this.state.page
    ) {
      this.fetchImages();
    }
  }

  handleSearchSubmit = query => {
    this.setState({ searchQuery: query, page: 1, images: [], totalImages: 0 });
  };

  fetchImages = async () => {
    const { searchQuery, page } = this.state;

    this.setState({ loading: true });

    try {
      const response = await backend.requestImages(
        searchQuery,
        page,
        this.imagesPerPage
      );
      this.setState(prevState => ({
        images: [...prevState.images, ...response.data.hits],
        totalImages: response.data.totalHits,
      }));
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleLoadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  openModal = largeImageURL => {
    this.setState({ showModal: true, largeImageURL });
  };

  closeModal = () => {
    this.setState({ showModal: false, largeImageURL: '' });
  };

  render() {
    const { images, totalImages, page, loading, showModal, largeImageURL } =
      this.state;
    return (
      <div className={css.App}>
        <Searchbar onSubmit={this.handleSearchSubmit} />
        <ImageGallery>
          {images.map(({ id, webformatURL, largeImageURL }) => (
            <ImageGalleryItem
              key={id}
              src={webformatURL}
              alt=""
              onClick={() => this.openModal(largeImageURL)}
            />
          ))}
        </ImageGallery>
        {loading && <Loader size={80} color="#00BFFF" />}
        {images.length >= this.imagesPerPage &&
          page * this.imagesPerPage < totalImages &&
          !loading && <Button onClick={this.handleLoadMore}>Load more</Button>}
        {showModal && (
          <Modal largeImageURL={largeImageURL} onClose={this.closeModal} />
        )}
      </div>
    );
  }
}

export { App };
