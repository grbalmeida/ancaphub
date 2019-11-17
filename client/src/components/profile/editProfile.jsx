import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  IconButton,
  Typography,
  Grid,
  TextField
} from '@material-ui/core';
import {
  Edit as EditIcon,
  Close as CloseIcon
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';
import { Formik, Field, Form } from 'formik';
import UpdateProfilePicture from './updateProfilePicture';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateUser } from '../../actions/userActions';

const DialogTitle = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

function EditProfile(props) {
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }
  const ProfileSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Nome muito curto!')
      .max(50, 'Nome muito longo!')
      .required('O campo nome é obrigatório!'),
    bio: Yup.string().max(160, 'Sua bio deve ter máximo 160 caracteres.!'),
    site: Yup.string().url('URL inválida!'),
    birthday: Yup.date().max(new Date(), 'Tu é viajante do tempo por acaso?')
  });

  return (
    <div>
      <Button variant="outlined" fullWidth onClick={handleClickOpen}>
        <EditIcon style={{ marginRight: '10px' }} /> Editar Perfil
      </Button>

      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Editar Perfil
        </DialogTitle>
        <Formik
          initialValues={{
            name: props.data.name,
            avatar: props.data.avatar || '',
            bio: props.data.bio || '',
            currentCity: props.data.currentCity || '',
            site: props.data.site || '',
            birthday: props.data.birthday || ''
          }}
          validationSchema={ProfileSchema}
          onSubmit={(values, actions) => {
            props.updateUser(values);
          }}
          render={formProps => {
            const {
              values,
              touched,
              errors,
              handleChange,
              handleBlur
            } = formProps;

            return (
              <Form>
                <DialogContent dividers>
                  <Grid container>
                    <Grid item xs={12}>
                      <Field
                        name="avatar"
                        uploadImage={props.uploadImage}
                        component={UpdateProfilePicture}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        type="text"
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Nome Completo"
                        name="name"
                        autoComplete="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={errors.name && touched.name && errors.name}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        multiline
                        rows="2"
                        type="text"
                        margin="normal"
                        fullWidth
                        id="bio"
                        label="Bio"
                        name="bio"
                        value={values.bio}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={errors.bio && touched.bio && errors.bio}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        type="text"
                        margin="normal"
                        fullWidth
                        id="currentCity"
                        label="Cidade Atual"
                        name="currentCity"
                        autoComplete="currentCity"
                        value={values.currentCity}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={
                          errors.currentCity &&
                          touched.currentCity &&
                          errors.currentCity
                        }
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        type="text"
                        margin="normal"
                        fullWidth
                        id="site"
                        label="Site"
                        name="site"
                        autoComplete="site"
                        value={values.site}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={errors.site && touched.site && errors.site}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        id="birthday"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Data de Nascimento"
                        type="date"
                        name="birthday"
                        InputLabelProps={{
                          shrink: true
                        }}
                        autoComplete="birthday"
                        defaultValue={values.birthday.substring(0, 10)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={
                          errors.birthday && touched.birthday && errors.birthday
                        }
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button type="submit" color="primary">
                    Salvar
                  </Button>
                </DialogActions>
              </Form>
            );
          }}
        />
      </Dialog>
    </div>
  );
}
const mapDispatchToProps = dispatch =>
  bindActionCreators({ updateUser }, dispatch);
export default connect(
  null,
  mapDispatchToProps
)(EditProfile);