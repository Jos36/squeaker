import { Component } from 'react';
import { connect } from 'react-redux';

class Header extends Component {
    state = {  }
    render() { 
        return ( 
            <div className="header">
            <h2>{this.props.activeReducer}</h2>
        </div>
         );
    }
}
 
const mapStateToProps = state =>{
    return (state)
  }
  export default connect(mapStateToProps)(Header);
  