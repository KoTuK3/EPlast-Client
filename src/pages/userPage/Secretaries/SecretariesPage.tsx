import React, { useEffect, useState } from 'react';
import userApi from '../../../api/UserApi';
import AvatarAndProgress from '../personalData/AvatarAndProgress';
import { useParams, useHistory } from 'react-router-dom';
import { Data } from '../Interface/Interface';
import notificationLogic from '../../../components/Notifications/Notification';
import { Card, Form, Input } from 'antd';
import './Secretaries.less'
import {UserCitySecretaryTable} from './UserCitySecretaryTable';



const tabList = [
    {
        key: '1',
        tab: 'Діловодства округу',
    },
    {
        key: '2',
        tab: 'Діловодства станиці',
    },
    {
        key: '3',
        tab: 'Діловодства куреня',
    },
];



export const Secretaries = () => {
    const { userId } = useParams();
    const [data, setData] = useState<Data>();
    const [noTitleKey, setKey] = useState<string>('1');


    const fetchData = async () => {
        await userApi.getById(userId).then(response => {
            setData(response.data);
        }).catch(() => { notificationLogic('error', "Щось пішло не так") })
    };

    useEffect(() => {
        fetchData();
    }, [userId]);





    const onTabChange =  (key:string) => {
        console.log(noTitleKey)
        setKey(key);
       
       console.log(noTitleKey)
       
     };




     const contentListNoTitle: { [key: string]: any } = {
        1: <div key='1'>Округ</div>,
        2: <div key='2'><UserCitySecretaryTable UserId={userId}/></div>,
        3: <div key='3'>Курінь</div>
      };


    return (
        <>
            <h1>Діловодства</h1>
            <p></p>
            <div className="container">
                <Form name="basic" className="formContainer">

                    <div className="avatarWrapper">
                        <AvatarAndProgress imageUrl={data?.user.imagePath} time={data?.timeToJoinPlast} firstName={data?.user.firstName} lastName={data?.user.lastName} isUserPlastun={data?.isUserPlastun} />
                    </div>

                    <div className="allFields">
                        <div className="rowBlock">
                            <Card
                                style={{ width: '100%' }}
                                tabList={tabList}
                                activeTabKey={noTitleKey}

                                onTabChange={key => {
                                    onTabChange(key);

                                }}
                            >
                                {contentListNoTitle[noTitleKey]}
                            </Card>

                        </div>
                    </div>
                </Form>
            </div>
        </>
    )

}

export default Secretaries;