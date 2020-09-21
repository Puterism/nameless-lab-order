import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  dot: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    marginRight: '5px',
    borderRadius: '50%',
    backgroundColor: (props) => props.color,
    verticalAlign: 'middle',
  },
}));

export default useStyles;
