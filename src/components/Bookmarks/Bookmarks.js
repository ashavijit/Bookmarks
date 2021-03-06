import React, {useState,useContext,useEffect} from 'react';
import firebase from 'firebase';
import { IconButton, Dialog, Typography, Grid } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import Helmet from 'react-helmet';


import SingleBookmark from './SingleBookmark/SingleBookmark';

import { AuthContext } from '../../context/AuthContext'
import { db } from '../../firebase/firebase';

import './BookMarks.css'
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';



const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});
  
const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon style={{color: '#26202D'}}/>
        </IconButton>
        ) : null}
    </MuiDialogTitle>
    );
});
  
const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);


export default function Bookmarks() {
    const [sortId, setSortId] = useState(0)
    const [bookmarks, setBookmarks] = useState([]);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [search, setSearch] = useState('')
    const { currentUser }  = useContext(AuthContext)



    useEffect(() => {
        if(sortId === 0) {
            db.collection('users').doc(currentUser.uid)
                .collection('bookmarks').orderBy('createdAt', 'asc').onSnapshot(snapshot => {
                setBookmarks(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                )
            })
        }
        else if (sortId === 1) {
            db.collection('users').doc(currentUser.uid)
                .collection('bookmarks').orderBy('count', 'desc').onSnapshot(snapshot => {
                setBookmarks(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                )
            })
        }
        else if (sortId === 2) {
            db.collection('users').doc(currentUser.uid)
            .collection('bookmarks').orderBy('bName').onSnapshot(snapshot => {
            setBookmarks(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            )
        })
        }
    }, [currentUser.uid, sortId])

    
    const primaryColors = ['#f6bcf6', '#f3a5f3', '#ee82ee', '#ea62ea', '#cc00cc', '#ff33ff', '#bf40bf', '#d279d2', '#b300b3', '#cc6699', '#bf4080', '#d279a6']
    const indexCol = Math.floor(Math.random() * primaryColors.length)


    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const createBookmark = () => {
        if(name && url) {
            db.collection('users').doc(currentUser.uid).collection('bookmarks').add({
                bName: name,
                bUrl: url,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                count: 0,
                color: primaryColors[indexCol]
            })

        }
        setOpen(false);
        setName('')
        setUrl('')

    }

    const filteredBookmarks = bookmarks.filter((art) => {
        return art.data.bName.toLowerCase().includes(search.toLowerCase())
    })

    const handleMostVisited = () => {
        if(sortId === 1) {
            setSortId(0)
        }
        else {
            setSortId(1)
        }
    }

    const handleAlphabetical = () => {
        if(sortId === 2) {
            setSortId(0)
        }
        else {
            setSortId(2)
        }
    }


    return (
        <>
        <Helmet>
            <title>Browzica | Bookmarks</title>
        </Helmet>
        <div className="bookmark">
            <Navbar />
            <div className="bookmark-container">
                <h2>Bookmarks</h2>
                <div className="search-sort">
                    <div className="bookmark-search">
                        <SearchIcon />
                        <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                    </div>
                    <div className="bookmark-sort">
                        <h3>Sort by</h3>

                        <div className="sort-btns">
                            <button onClick={handleMostVisited}  className="mostVisisted-btn" style={{ boxShadow: sortId === 1 ? '5px 5px 10px #000000a0, -5px -5px 10px #ffffff40' : 'none'}}>Most Visited</button>
                            <button onClick={handleAlphabetical} className="alphabetical-btn" style={{ boxShadow: sortId === 2 ? '5px 5px 10px #000000a0, -5px -5px 10px #ffffff40' : 'none'}}>Alphabetical</button>
                        </div>
                    </div>
                </div>
                
                <div className="bookmark-body">
                    <Grid container>
                        <button onClick={handleOpen} className="add-button">
                            Add
                            <AddIcon/>
                        </button>
                        
                        {
                            filteredBookmarks && filteredBookmarks.map(bookmark => (
                                <SingleBookmark 
                                    name={bookmark.data.bName}
                                    url={bookmark.data.bUrl}
                                    key={bookmark.id}
                                    id={bookmark.id}
                                    uid={currentUser.uid}
                                    count={bookmark.data.count}
                                    color={bookmark.data.color}
                                />
                            ))
                        }
                    </Grid>
                </div>
            </div>

            <Dialog disableScrollLock onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} className="bookmark-dialog">
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    <h3 className="dialog-title">Add Bookmark</h3>
                </DialogTitle>
                <DialogContent>
                <div className="bookmark-details">
                    <div className="name-label">
                        <label>
                            NAME:
                        </label>
                        <input type="text" name="Name" value={name}  onChange={(e)=>setName(e.target.value)}/>
                    </div>
                    <div className="url-label">
                        <label>
                            URL:
                        </label>
                        <input type="text" name="Url" value={url} onChange={(e)=>setUrl(e.target.value)}/>
                    </div>
                </div>
                </DialogContent>
                <DialogActions>
                    <div className="modal-buttons">
                        <button  onClick={handleClose} className="cancel-button">Cancel</button>
                        <button  onClick={createBookmark} className="save-button">Save</button>
                    </div>
                </DialogActions>
            </Dialog>         
        </div>
        <Footer />
        </>
    )
}


