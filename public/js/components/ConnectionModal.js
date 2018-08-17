class ConnectionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      database: '',
      host: '',
      port: '',
      username: '',
      password: '',
      nickname: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetErrors = this.resetErrors.bind(this);
  }

  componentDidMount() {

  }

  resetErrors() {
    this.setState({
      databaseError: false,
      hostError: false,
      portError: false,
      usernameError: false
    })
  }
  handleChange(event) {
    let key = event.target.id
    this.setState({ [ key ]: event.target.value });
  }

  handleSubmit(event) {
    this.resetErrors()
    // Validate that the required fields have a value
    this.setState({
      databaseError: (this.state.database) ? false : true,
      hostError: (this.state.host) ? false : true,
      portError: (this.state.port) ? false : true,
      usernameError: (this.state.username) ? false : true
    }, (e) => {
      if (this.state.databaseError || this.state.hostError || this.state.portError || this.state.usernameError) {
        return
      } else {
        fetch('/settings/connection', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify(this.state),
        })
        .then(response => { return response.json() })
        .then(json => {
          console.log(json)
        })
        .catch(error => {
          console.log(error)
        })
      }
    })
    event.preventDefault()
  }

  render() {
    return (
      <div className='pp-modal-backdrop'>
        <div className='pp-modal'>
          <div className='pp-modal-header'>
            <div className='pp-modal-close'>
              x
            </div>
          </div>
          <div className='pp-modal-inner'>
            <h1>Create connection</h1>
            <form onSubmit={this.handleSubmit}>
              <div className={this.state.databaseError ? 'form-group has-error' : 'form-group'}>
                <label className='control-label' htmlFor='database'>Database</label>
                <input type='text' className='form-control' id='database' value={this.state.database} onChange={this.handleChange}></input>
                <span className={this.state.databaseError ? 'help-block' : 'hidden'}>A database is required</span>
              </div>
              <div className='row'>
                <div className='col-sm-9'>
                  <div className={this.state.hostError ? 'form-group has-error' : 'form-group'}>
                    <label className='control-label' htmlFor='host'>Host</label>
                    <input type='text' id='host' className='form-control' placeholder='localhost' value={this.state.host} onChange={this.handleChange}></input>
                    <span className={this.state.hostError ? 'help-block' : 'hidden'}>A host is required</span>
                  </div></div>
                <div className='col-sm-3'>
                  <div className={this.state.portError ? 'form-group has-error' : 'form-group'}>
                    <label className='control-label' htmlFor='port'>Port</label>
                    <input type='number' id='port' className='form-control' placeholder='5432' value={this.state.port} onChange={this.handleChange}></input>
                    <span className={this.state.portError ? 'help-block' : 'hidden'}>A port is required</span>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-sm-6'>
                  <div className={this.state.usernameError ? 'form-group has-error' : 'form-group'}>
                    <label className='control-label' htmlFor='username'>Username</label>
                    <input type='text' id='username' className='form-control' placeholder='postgres' value={this.state.username} onChange={this.handleChange}></input>
                    <span className={this.state.portError ? 'help-block' : 'hidden'}>A port is required</span>
                  </div>
                </div>
                <div className='col-sm-6'>
                  <div className='form-group'>
                    <label className='control-label' htmlFor='password'>Password</label>
                    <input type='password' className='form-control' id='password' value={this.state.password} onChange={this.handleChange}></input>
                  </div>
                </div>
              </div>

              <div className='form-group'>
                <label className='control-label' htmlFor='nickname'>Nickname (optional)</label>
                <input type='text' id='nickname' className='form-control' value={this.state.nickname} onChange={this.handleChange}></input>
              </div>

              <div className='create-connection-buttons'>
                <button type='submit' className='btn btn-primary pull-right submit-connection'>Done</button>
                <button className='btn btn-danger pull-right'>Cancel</button>
              </div>

            </form>

          </div>
        </div>
      </div>
    )
  }
}
