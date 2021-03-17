import React, {useState} from 'react';
import FormikField from './../components/FormikField/index'
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ErrorAlert from './../components/ErrorAlert/index';
import api from './../api';
import { useHistory } from 'react-router-dom';

import './Login.scss';


interface ILoginForm {
  email: string,
  password: string
}

const initialValues = {
  email: '',
  password: ''  
}

const validationSchema = Yup.object().shape({
  email: Yup.string().required('email é obrigatório').email('Digite um email válido'),
  password: Yup.string().required('senha é obrigatória')
})

export default function Login(props: any) {

  let history = useHistory();

  const [modalAlertErro, setModalAlertErro] = useState(false);

  const handleSubmit = (values: ILoginForm): void => {
    api.post('/register', values).then(res => {
      if(res.data) {
        history.push({pathname: '/agenda'})

      }
      },(err) => {
        setModalAlertErro(true);
      
      }
    );
  }

  return (
    <>
      {
        modalAlertErro && 
          <ErrorAlert
            showAlertErro={setModalAlertErro}
            text={'Deu ruim :('}
          />
      }
      <div className='login-page'>
        <div className='background-image'/>
        <div className='login-title'>Agenda de Churras</div>
        <div className='login-form'>
          <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
          >
            {(formikProps) => {
              return (
                <>
                  <Form>
                    <div className='login-form-label'>Login</div>
                      <FormikField
                        name='email'
                        placeholder='e-mail'
                      />
                      <div className='login-form-label'>Senha</div>
                      <FormikField
                        placeholder='senha'
                        name='password'
                        type='password'
                      />
                      <div className='btn-login'>
                        <button className='btn-entrar' type='submit'>
                            Entrar
                        </button>
                      </div>
                  </Form>
                </>
              )
            }}
          </Formik>
        </div>
      </div>
    </>
  )
}