import * as React from 'react';

import { TextFieldProps } from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import TextField from '../TextField';

interface State {
  hidden: Boolean;
}

interface Props extends TextFieldProps {
  required?: boolean;
  tooltipText?: string;
 }

class HideShowText extends React.Component<Props, State> {
  state = {
    hidden: true,
  };

  toggleHidden = () => {
    this.setState({ hidden: !this.state.hidden });
  }

  render() {
    const { hidden } = this.state;
    const { required } = this.props;

    return (
      <TextField
        {...this.props}
        data-qa-hide={hidden}
        type={hidden ? 'password' : 'text'}
        required={required}
        InputProps={{
          startAdornment: hidden
            ? <Visibility onClick={this.toggleHidden} style={{ marginLeft: 14 }} />
            : <VisibilityOff onClick={this.toggleHidden} style={{ marginLeft: 14 }} />,
        }}
      />
    );
  }
}

export default HideShowText;
