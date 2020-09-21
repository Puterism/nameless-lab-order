import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 275,
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0),
  },
  orderQuantity: {
    minWidth: '60px',
    maxWidth: '100px',
  },
  cardButton: {
    width: '100%',
    borderRadius: 0,
  },
  header: {
    fontSize: '1.6em',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  deleteButton: {
    color: '#ba000d',
  },
  basketTable: {
    minWidth: '700px',
  },
}));

export default useStyles;
