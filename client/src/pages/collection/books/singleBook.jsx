import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
  Link
} from '@material-ui/core';
import { CloudDownload as DownloadIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import filesize from 'filesize'
import querystring from 'querystring'
import isEmpty from 'is-empty';
import axios from '../../../services/api'
import defaultThumbnail from '../../../assets/images/default-thumbnail.jpg'
import Template from '../../../components/template';
import Title from '../../../components/template/titleComponent'
import Categories from '../../../components/categories/showElementCategories';
import Ratings from '../../../components/collection/ratings';
import ProfilePicture from '../../../components/profile/profilePicture';
import LoadingItems from '../../../components/loaders/loadingItems'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchItem } from '../../../actions/itemActions';

function SingleBook(props) {
  const { id } = props.match.params;
  const [files, setFiles] = useState([]);

  useEffect(() => props.fetchItem(id), []);

  const {
    _id,
    title,
    author,
    categories,
    content,
    cover,
    user,
    extraFields
  } = props.book.item;

  const getFiles = () => {
    axios.get(`/api/upload?${querystring.stringify({ 'files': JSON.stringify(extraFields.downloadOptions) })}`)
      .then(result =>
        setFiles(result.data.map(file => ({
          id: file._id,
          name: file.originalname,
          readableSize: filesize(file.size),
          url: file.url,
        })))
      )
  }

  useEffect(() => {
    if (extraFields && extraFields.downloadOptions) {
      getFiles()
    }
  }, [extraFields])

  const useStyles = makeStyles(theme => ({
    banner: {
      position: 'absolute',
      left: 0,
      top: 0,
      background: `url(${cover ? cover.url : defaultThumbnail}) rgba(0,0,0,0.5)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '100%',
      height: '230px'
    },
    bannelOverlay: {
      width: '100%',
      height: '100%',
      background: 'black',
      opacity: 0.8
    },
    title: {
      fontWeight: 'bold',
      color: 'white',
      [theme.breakpoints.down('sm')]: {
        color: '#333',
      },
    },
    author: {
      fontWeight: 'light',
      color: 'white',
      [theme.breakpoints.down('sm')]: {
        color: '#aaa',
      },
    },
    icon: {
      color: '#ccc'
    }
  }));

  const classes = useStyles();

  return (
    <Template noPadding>
      {props.book.loading ? (
        <Box width="100%" height="100%" display="flex" alignContent="center" justifyContent="center">
          <LoadingItems />
        </Box>
      ) : (
          <>
            {!isEmpty(props.book.item) && props.book.item.type === 'book' && (
              <>
                <Title title={`${title} - ${author}`} />
                <div className={classes.banner}>
                  <div className={classes.bannelOverlay}></div>
                </div>
                <Container
                  style={{ position: 'absolute', marginTop: '100px', width: 'auto' }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={5} md={4}>
                      <Paper>
                        <img
                          src={cover ? cover.url : defaultThumbnail}
                          alt={`Capa do livro ${title}`}
                          style={{ width: '100%' }}
                        />
                        <List>
                          {files && files.map(download => (
                            <ListItem key={`${_id} ${download.name}`}>
                              <ListItemText primary={download.name} />
                              <ListItemSecondaryAction>
                                <IconButton
                                  edge="end"
                                  aria-label="Delete"
                                  className={classes.icon}
                                  href={download.url}
                                  target="_blank">
                                  <DownloadIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                      <Box mt={2}>
                        <span>Enviado por</span>
                        <Link
                          component={RouterLink}
                          to={`/usuario/${user._id}`}
                          underline="none"
                          color="textPrimary">
                          <Box display="flex" alignItems="center" mt={1}>
                            <ProfilePicture
                              avatar={user.avatar}
                              width="40px"
                              height="40px"
                            />
                            <span style={{ paddingLeft: '10px' }}>{user.name}</span>
                          </Box>
                        </Link>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={8}>
                      <Box mb={2}>
                        <Categories categories={categories} />
                        <Typography
                          variant="h4"
                          component="h2"
                          className={classes.title}>
                          {title}
                        </Typography>
                        <Typography
                          variant="h6"
                          component="h3"
                          className={classes.author}>
                          {author}
                        </Typography>
                      </Box>
                      <Typography variant="body1" style={{ paddingTop: '16px' }}>
                        {content}
                      </Typography>
                      <Box my={2}>
                        <Ratings item={props.book.item} />
                      </Box>
                    </Grid>
                  </Grid>
                </Container>
              </>
            )}
          </>
        )}
    </Template>
  );
}

const mapStateToProps = state => ({ book: state.items });
const mapDispatchToProps = dispatch =>
  bindActionCreators({ fetchItem }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleBook);