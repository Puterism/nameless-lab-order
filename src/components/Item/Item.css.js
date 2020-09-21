import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: '700px',
  },
  loadingPaper: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  verticalAlignMiddle: {
    verticalAlign: 'middle',
  },
  textAlignRight: {
    textAlign: 'right',
  },
}));

export default useStyles;
