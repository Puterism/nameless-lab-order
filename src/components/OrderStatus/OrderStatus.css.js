import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { red, green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  detailContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: '#eeeeee',
  },
  table: {
    minWidth: 700,
  },
  bold: {
    fontWeight: 'bold',
  },
  detailControl: {
    paddingTop: theme.spacing(2),
    '& button': {
      marginRight: theme.spacing(1),
    },
  },
}));

export const CancelButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(red[700]),
    backgroundColor: red[700],
    '&:hover': {
      backgroundColor: red[900],
    },
  },
}))(Button);

export const ConfirmButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(green[700]),
    backgroundColor: green[700],
    '&:hover': {
      backgroundColor: green[900],
    },
  },
}))(Button);

export default useStyles;
