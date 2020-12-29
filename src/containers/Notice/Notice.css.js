import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  header: {
    fontSize: '1.6em',
    fontWeight: 'bold',
  },
  articleMenuItemDelete: {
    color: red[700],
  },
  articleMenuIcon: {
    marginRight: '0.5em',
  },
  '@global': {
    '.ck-content .marker-yellow': {
      backgroundColor: 'var(--ck-highlight-marker-yellow)',
    },
    '.ck-content .marker-green': {
      backgroundColor: 'var(--ck-highlight-marker-green)',
    },
    '.ck-content .marker-pink': {
      backgroundColor: 'var(--ck-highlight-marker-pink)',
    },
    '.ck-content .marker-blue': {
      backgroundColor: 'var(--ck-highlight-marker-blue)',
    },
    '.ck-content .pen-red': {
      color: 'var(--ck-highlight-pen-red)',
      backgroundColor: 'transparent',
    },
    '.ck-content .pen-green': {
      color: 'var(--ck-highlight-pen-green)',
      backgroundColor: 'transparent',
    },
    '.ck-content .image-style-side': {
      float: 'right',
      marginLeft: 'var(--ck-image-style-spacing)',
      maxWidth: '50%',
    },
    '.ck-content .image-style-align-left': {
      float: 'left',
      marginRight: 'var(--ck-image-style-spacing)',
    },
    '.ck-content .image-style-align-center': {
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    '.ck-content .image-style-align-right': {
      float: 'right',
      marginLeft: 'var(--ck-image-style-spacing)',
    },
    '.ck-content blockquote': {
      overflow: 'hidden',
      paddingRight: '1.5em',
      paddingLeft: '1.5em',
      marginLeft: '0',
      marginRight: '0',
      fontStyle: 'italic',
      borderLeft: 'solid 5px hsl(0, 0%, 80%)',
    },
    '.ck-content[dir="rtl"] blockquote': {
      borderLeft: '0',
      borderRight: 'solid 5px hsl(0, 0%, 80%)',
    },
    '.ck-content hr': {
      margin: '15px 0',
      height: 4,
      background: 'hsl(0, 0%, 87%)',
      border: '0',
    },
    '.ck-content .image': {
      display: 'table',
      clear: 'both',
      textAlign: 'center',
      margin: '1em auto',
    },
    '.ck-content .image img': {
      display: 'block',
      margin: '0 auto',
      maxWidth: '100%',
      minWidth: 50,
    },
    '.ck-content .image.image_resized': {
      maxWidth: '100%',
      display: 'block',
      boxSizing: 'border-box',
    },
    '.ck-content .image.image_resized img': {
      width: '100%',
    },
    '.ck-content .image.image_resized > figcaption': {
      display: 'block',
    },
    '.ck-content .image > figcaption': {
      display: 'table-caption',
      captionSide: 'bottom',
      wordBreak: 'break-word',
      color: 'hsl(0, 0%, 20%)',
      backgroundColor: 'hsl(0, 0%, 97%)',
      padding: '.6em',
      fontSize: '.75em',
      outlineOffset: -1,
    },
    '.ck-content code': {
      backgroundColor: 'hsla(0, 0%, 78%, 0.3)',
      padding: '.15em',
      borderRadius: 2,
    },
    '.ck-content .text-tiny': {
      fontSize: '.7em',
    },
    '.ck-content .text-small': {
      fontSize: '.85em',
    },
    '.ck-content .text-big': {
      fontSize: '1.4em',
    },
    '.ck-content .text-huge': {
      fontSize: '1.8em',
    },
    '.ck-content .table': {
      margin: '1em auto',
      display: 'table',
    },
    '.ck-content .table table': {
      borderCollapse: 'collapse',
      borderSpacing: '0',
      width: '100%',
      height: '100%',
      border: '1px double hsl(0, 0%, 70%)',
    },
    '.ck-content .table table td, .ck-content .table table th': {
      minWidth: '2em',
      padding: '.4em',
      border: '1px solid hsl(0, 0%, 75%)',
    },
    '.ck-content .table table th': {
      fontWeight: 'bold',
      background: 'hsla(0, 0%, 0%, 5%)',
    },
    '.ck-content[dir="rtl"] .table th': {
      textAlign: 'right',
    },
    '.ck-content[dir="ltr"] .table th': {
      textAlign: 'left',
    },
    '.ck-content .page-break': {
      position: 'relative',
      clear: 'both',
      padding: '5px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '.ck-content .page-break::after': {
      content: "''",
      position: 'absolute',
      borderBottom: '2px dashed hsl(0, 0%, 77%)',
      width: '100%',
    },
    '.ck-content .page-break__label': {
      position: 'relative',
      zIndex: '1',
      padding: '.3em .6em',
      display: 'block',
      textTransform: 'uppercase',
      border: '1px solid hsl(0, 0%, 77%)',
      borderRadius: 2,
      fontFamily: 'Helvetica, Arial, Tahoma, Verdana, Sans-Serif',
      fontSize: '0.75em',
      fontWeight: 'bold',
      color: 'hsl(0, 0%, 20%)',
      background: 'hsl(0, 0%, 100%)',
      boxShadow: '2px 2px 1px hsla(0, 0%, 0%, 0.15)',
      webkitUserSelect: 'none',
      mozUserSelect: 'none',
      msUserSelect: 'none',
      userSelect: 'none',
    },
    '.ck-content .media': {
      clear: 'both',
      margin: '1em 0',
      display: 'block',
      minWidth: '15em',
    },
    '.ck-content .todo-list': {
      listStyle: 'none',
    },
    '.ck-content .todo-list li': {
      marginBottom: 5,
    },
    '.ck-content .todo-list li .todo-list': {
      marginTop: 5,
    },
    '.ck-content .todo-list .todo-list__label > input': {
      webkitAppearance: 'none',
      display: 'inline-block',
      position: 'relative',
      width: 'var(--ck-todo-list-checkmark-size)',
      height: 'var(--ck-todo-list-checkmark-size)',
      verticalAlign: 'middle',
      border: '0',
      left: -25,
      marginRight: -15,
      right: '0',
      marginLeft: '0',
    },
    '.ck-content .todo-list .todo-list__label > input::before': {
      display: 'block',
      position: 'absolute',
      boxSizing: 'border-box',
      content: "''",
      width: '100%',
      height: '100%',
      border: '1px solid hsl(0, 0%, 20%)',
      borderRadius: 2,
      transition:
        '250ms ease-in-out box-shadow, 250ms ease-in-out background, 250ms ease-in-out border',
    },
    '.ck-content .todo-list .todo-list__label > input::after': {
      display: 'block',
      position: 'absolute',
      boxSizing: 'content-box',
      pointerEvents: 'none',
      content: "''",
      left: 'calc( var(--ck-todo-list-checkmark-size) / 3 )',
      top: 'calc( var(--ck-todo-list-checkmark-size) / 5.3 )',
      width: 'calc( var(--ck-todo-list-checkmark-size) / 5.3 )',
      height: 'calc( var(--ck-todo-list-checkmark-size) / 2.6 )',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderWidth:
        '0 calc( var(--ck-todo-list-checkmark-size) / 8 ) calc( var(--ck-todo-list-checkmark-size) / 8 ) 0',
      transform: 'rotate(45deg)',
    },
    '.ck-content .todo-list .todo-list__label > input[checked]::before': {
      background: 'hsl(126, 64%, 41%)',
      borderColor: 'hsl(126, 64%, 41%)',
    },
    '.ck-content .todo-list .todo-list__label > input[checked]::after': {
      borderColor: 'hsl(0, 0%, 100%)',
    },
    '.ck-content .todo-list .todo-list__label .todo-list__label__description': {
      verticalAlign: 'middle',
    },
    '.ck-content pre': {
      padding: '1em',
      color: 'hsl(0, 0%, 20.8%)',
      background: 'hsla(0, 0%, 78%, 0.3)',
      border: '1px solid hsl(0, 0%, 77%)',
      borderRadius: 2,
      textAlign: 'left',
      direction: 'ltr',
      tabSize: '4',
      whiteSpace: 'pre-wrap',
      fontStyle: 'normal',
      minWidth: 200,
    },
    '.ck-content pre code': {
      background: 'unset',
      padding: '0',
      borderRadius: '0',
    },
    '.ck-content .mention': {
      background: 'var(--ck-color-mention-background)',
      color: 'var(--ck-color-mention-text)',
    },
    '@media print': {
      '.ck-content .page-break': {
        padding: '0',
      },
      '.ck-content .page-break::after': {
        display: 'none',
      },
    },
  },
}));

export default useStyles;
