import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import activeMembershipApi from '../../../../api/activeMembershipApi';
const { confirm } = Modal;

const DeleteDegreeConfirm = (userId : string, plastDegreeId : number, handleDelete : any) =>{
    return confirm({
        title: 'Ви справді хочете видалити даний ступінь користувачу?',
        icon: <ExclamationCircleOutlined style={{ color: '#3c5438' }} />,
        okText: 'Так',
        cancelText: 'Ні',
        onOk () { 
          const remove = async () => {
           await activeMembershipApi.removeUserPlastDegree(userId, plastDegreeId);
          };
          remove();
          handleDelete();
        },
      });
};

 export default DeleteDegreeConfirm;