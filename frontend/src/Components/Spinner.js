import React, { Component } from 'react'
import Loader from './Loader.gif'
export default class Spinner extends Component {
  render() {
    return (
      <div className='text-center loader-div'>
        <img src={Loader} alt="spinner error" className='display-6 loader' />
      </div>
    )
  }
}
