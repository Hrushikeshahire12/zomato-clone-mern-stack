import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import './Style/Style.css'


class QuickSearches extends Component {
    handleClick = (id, name) => {
        const location_id = sessionStorage.getItem('location_id');
        if (location_id) {
            this.props.history.push(`/filter?mealtype=${id}&mealtype_name=${name}&location=${location_id}`);
        } else {
            this.props.history.push(`/filter?mealtype=${id}&mealtype_name=${name}`)
        }
    }
    render() {

        const { quicksearch } = this.props;
        return (
            <div>
              
                <div className="bottomDiv">
                    <div className="resto">
                        <h1 className="p1">Quick Searches </h1>
                    </div>
                    <div className='type-meal'>
                      
                        <h1 style={{ color: "red" }} >Discover restaurants by type of meal</h1>
                      
                 
                    </div>
                    <div className='grid-container'>

                        {quicksearch.map((item) => {
                            return (
                                <div className='grid-div' onClick={() => this.handleClick(item.mealtype_id, item.name)}>
                                    <img className='break_img' src={item.image} alt="no image" />
                                    <h3 className='breakfastheader'>{item.name}<br></br>{item.content}</h3>
                                </div>

                            );
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(QuickSearches)
