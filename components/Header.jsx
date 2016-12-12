import './Header.css';
import React, { Component } from 'react';

class Header extends Component {
  getImageUrl = () =>
     `https://cdn.auth0.com/avatars/${window.config.AUTH0_DOMAIN.slice(0, 2).toLowerCase()}.png`

  render() {
    const { user, onLogout } = this.props;
    return (<header className="dashboard-header" style={{ backgroundColor: '#fbfbfb' }}>
      <nav role="navigation" className="navbar navbar-default">
        <div className="container">
          <div className="navbar-header">
            <img src="https://cdn.rawgit.com/auth0/auth0-user-import-export-extension/master/assets/logo.svg" style={{ float: 'left', minWidth: '55px', minHeight: '55px', display: 'block', marginRight: '15px' }} />
            <a className="navbar-brand" href="#" style={{ width: '50%' }}>Users Import / Export</a>
          </div>
          <div id="navbar-collapse" className="collapse navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li className="dropdown">
                <span role="button" data-toggle="dropdown" data-target="#" className="btn-dro btn-username">
                  <img src={this.getImageUrl()} className="picture avatar" />
                  <span className="username-text truncate">
                    {window.config.AUTH0_DOMAIN.split('.')[0]}
                  </span>
                  <i className="icon-budicon-460" />
                </span>
                <ul role="menu" className="dropdown-menu">
                  <li role="presentation">
                    <a href="#" role="menuitem" tabIndex="-1" onClick={onLogout}>
                      Logout
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>);
  }
}

Header.propTypes = {
  user: React.PropTypes.object,
  onLogout: React.PropTypes.func.isRequired
};

export default Header;
