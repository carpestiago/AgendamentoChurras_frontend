import React from 'react';
import FormikField from './../components/FormikField/index'
import { Formik, Form } from 'formik';

import './Login.scss';


export default function Login(props: any) {

  return (
    <div className='login-page'>

      <div className='background-image'/>
        <div className='login-title'>Agenda de Churras</div>
        <div className='login-form'>
          <Formik
              initialValues={() => {}}
              onSubmit={() => {}}
              validationSchema={() => {}}
          >
              {() => {
                  return (
                      <>
                          <Form>
                            <div className='login-form-label'>Login</div>
                              <FormikField
                                name='login'
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
  )
}