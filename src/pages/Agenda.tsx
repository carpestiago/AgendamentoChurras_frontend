import React, {useState, useEffect} from 'react';
import {ReactComponent as MembersIcon} from './../resources/icon_people.svg'
import {ReactComponent as BudgetIcon} from './../resources/icon_money.svg'
import {ReactComponent as BarbecueIcon} from './../resources/icone-churras.svg'
import ErrorAlert from './../components/ErrorAlert/index';
import { parseISO, format } from "date-fns";
import api from './../api';
import { useHistory } from 'react-router-dom';

import './Agenda.scss';


export default function Agenda(props: any) {

    let history = useHistory();
    const [stateDetalhes, setStateDetalhes] = useState<any[]>([]);
    const [listaChurras, setChurras] = useState<string[]>([]);
    const [modalAlertErro, setModalAlertErro] = useState(false);

    const mostraDeDateISOparaDataPtBr = (value: string, formatPadrao: string = "dd/MM"): string => format(parseISO(value), formatPadrao);

    useEffect(() => {
        const getListaChurras = async () => {
            await api.get<any>('/listarChurras').then(res => {
            if(res.data) {
                setChurras(res.data)

            }},(err) => {
                setModalAlertErro(true);
            });
        }

        getListaChurras()
    }, [])
    
    function openPage() {
        history.push({pathname: '/cadastro'})
    }

    const handleOpen = (card: any) => {
        setStateDetalhes(card);
    };

    return (
        <>
            {
                modalAlertErro && 
                    <ErrorAlert
                        showAlertErro={setModalAlertErro}
                        text={'Deu ruim :('}
                    />
            }
            <div className='agenda-page'>
                <div className='background-image'/>
                <div className='agenda-title'>Agenda de Churras</div>
                <div className='agenda-box-cards'>
                    {
                        listaChurras && listaChurras.map((card: any, index) => {
                            return (
                                <div
                                    className='agenda-card'
                                    key={index}
                                    onClick={() => {
                                        handleOpen(card)
                                        history.push({pathname: '/detalhes', state: card._id})
                                    }}
                                >
                                    <div className='card-data'>
                                        {mostraDeDateISOparaDataPtBr(card.data)}
                                    </div>
                                    <span className='card-name'>
                                        {card.nomeChurras}
                                    </span>
                                    <div className='card-members'>
                                        <MembersIcon />
                                        {card.participantes.length}
                                    </div>
                                    <div className='card-budget'>
                                        <BudgetIcon />
                                        R${card.valorTotal}
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className='agenda-card-add' onClick={openPage}>
                        <BarbecueIcon />
                        <span>Adicionar Churras</span>
                    </div>
                </div>
            </div>
        </>
    )
}