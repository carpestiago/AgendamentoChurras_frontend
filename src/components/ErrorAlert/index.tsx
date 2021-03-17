import React from 'react';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import './ErrorAlert.scss';

const ErrorAlert = (props:any) => {

    return (
        
        <div className="error-container">
            <div className="error-box">
                    <CancelOutlinedIcon onClick={() => props.showAlertErro(false)} className="btn-close" />
                <div className='error-header'>
                    <ErrorOutlineOutlinedIcon />
                    <div className='title-header'>Erro</div>
                </div>
                <div className="error-text">{props.text}</div>
            </div>
        </div>
    )
}

export default ErrorAlert;