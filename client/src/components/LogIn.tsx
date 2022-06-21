import * as React from 'react'
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'
import background from "../images/van-336606_1280.jpg"

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }
  
  render() {
    return (      
      <div>
        <div  className="masthead" style={{ backgroundImage: `url(${background})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}} > 
        </div>
        <div className="my-div">
          <h1>Plan your trip now</h1>
          <Button className="my-button" onClick={this.onLogin}  >Log in</Button>
        </div>
      </div>
    )
  }
}
