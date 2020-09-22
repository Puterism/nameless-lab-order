import { makeStyles } from '@material-ui/core/styles';

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

export default useStyles;
