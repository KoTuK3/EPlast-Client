import React, { useState, useEffect } from "react";
import classes from "./Form.module.css";
import {
  Form,
  Input,
  DatePicker,
  AutoComplete,
  Select,
  Button,
  Row,
  Col,
} from "antd";
import kadrasApi from "../../api/KadraVykhovnykivApi";
import adminApi from "../../api/adminApi";
import notificationLogic from '../../components/Notifications/Notification';
import NotificationBoxApi from '../../api/NotificationBoxApi';
import{
  emptyInput,
  maxLength,
} from "../../components/Notifications/Messages"

type FormAddKadraProps = {
    showModal: (visibleModal: boolean) => void;  
    onAdd: () => void;
}


 const AddNewKadraForm: React.FC<FormAddKadraProps> = (props: any)=>{
    const  { showModal, onAdd } = props;
    const [form] = Form.useForm();
    const [users, setUsers] = useState<any[]>([{
        user:{
            id: '',
            firstName: '',
            lastName:'',
            birthday:''
        },
        regionName:'',
        cityName:'',
        clubName:'',
        userPlastDegreeName:'',
        userRoles:''
        
      }])


    const [types, setTypes] = useState<any[]>([{
        id: '',
        name: '',
      }])
    const dateFormat = "DD.MM.YYYY";

     const createNotifications = async (userId : string, kadraTypeName : string) => {
        await NotificationBoxApi.createNotifications(
            [userId],
            `Ваc було додано в кадру виховників: '${kadraTypeName}'. `,
            NotificationBoxApi.NotificationTypes.UserNotifications,
            `/kadra`,
            `Переглянути`
            );

        await NotificationBoxApi.getCitiesForUserAdmins(userId)
            .then(res => {
                res.cityRegionAdmins.length !== 0 &&
                res.cityRegionAdmins.forEach(async (cra) => {
                    await NotificationBoxApi.createNotifications(
                        [cra.cityAdminId, cra.regionAdminId],
                        `${res.user.firstName} ${res.user.lastName}, який є членом станиці: '${cra.cityName}' був доданий в кадру виховників: '${kadraTypeName}'. `,
                        NotificationBoxApi.NotificationTypes.UserNotifications,
                        `/kadra`,
                        `Переглянути`
                        );
                })                
            });
     } 

      const handleSubmit = async (values : any)=>{
        const newKadra  : any= {
            id: 0,

            userId: JSON.parse(values.userId).user.id,

            KadraVykhovnykivTypeId:JSON.parse(values.KadraVykhovnykivType).id,

            dateOfGranting: values.dateOfGranting,

            numberInRegister: values.numberInRegister,

            basisOfGranting:values.basisOfGranting,

            link: values.link,
  
        }

         kadrasApi.doesRegisterNumberExist(newKadra.numberInRegister).then(responce=>{
            if (responce.data==false){
                 kadrasApi.doesUserHaveStaff(newKadra.userId,newKadra.KadraVykhovnykivTypeId).then(  async response=>{

                    if(response.data==false){
                      await kadrasApi.createKadra(newKadra)
                      form.resetFields();
                      onAdd();
                      notificationLogic('success', "Користувач успішно отримав відзнаку");

                      await createNotifications(newKadra.userId, JSON.parse(values.KadraVykhovnykivType).name);
                     }
                     else{
                      notificationLogic('error', "Користувач вже отримував цю відзнаку");
                      form.resetFields();
                      onAdd();
                     }
          
                 })
            }
                else{
                    notificationLogic('error', "Номер реєстру вже зайнятий");
                    form.resetFields();
                    onAdd();

                    notificationLogic(
                    "success",
                    "Користувач успішно отримав відзнаку"
                    );
                }; 
        });
    }

  const handleCancel = () => {
    form.resetFields();
    showModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await kadrasApi.getAllKVTypes().then((response) => {
        setTypes(response.data);
      });
      await adminApi.getUsersForTable().then((response) => {
        setUsers(response.data);
      });
    };
    fetchData();
  }, []);

  return (
    <Form name="basic" onFinish={handleSubmit} form={form}>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={classes.formField}
            label="Користувач"
            labelCol={{ span: 24 }}
            name="userId"
            rules={[
              {
                required: true,
                message: emptyInput(),
              },
            ]}
          >
            <Select showSearch className={classes.inputField}>
              {users?.map((o) => (
                <Select.Option key={o.user.id} value={JSON.stringify(o)}>
                  {o.user.firstName + " " + o.user.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={classes.formField}
            label="Тип кадри"
            labelCol={{ span: 24 }}
            name="KadraVykhovnykivType"
            rules={[
              {
                required: true,
                message: emptyInput(),
              },
            ]}
          >
            <Select filterOption={false} className={classes.inputField}>
              {types?.map((o) => (
                <Select.Option key={o.id} value={JSON.stringify(o)}>
                  {o.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={classes.formField}
            label="Дата вручення"
            labelCol={{ span: 24 }}
            name="dateOfGranting"
            rules={[
              {
                required: true,
                message: emptyInput(),
              },
            ]}
          >
            <DatePicker 
                format={dateFormat}
                className={classes.selectField}/>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={classes.formField}
            label="Номер в реєстрі"
            labelCol={{ span: 24 }}
            name="numberInRegister"
            rules={[
              {
                required: true,
                message: emptyInput(),
              },
              {
                max: 6,
                message: maxLength(6),
              },
            ]}
          >
            <Input
              type="number"
              min={1}
              max={999999}
              className={classes.inputField}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={classes.formField}
            label="Причина надання"
            labelCol={{ span: 24 }}
            name="basisOfGranting"
            rules={[
              {
                required: true,
                message: emptyInput(),
              },
              { max: 100, message: maxLength(100) },
            ]}
          >
            <Input className={classes.inputField} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={classes.formField}
            label="Лінк"
            labelCol={{ span: 24 }}
            name="link"
            rules={[
              { max: 500, message: maxLength(500) },
            ]}
          >
            <Input className={classes.inputField} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item>
            <div className={classes.cardButton}>
              <Button key="back" onClick={handleCancel} className={classes.buttons}>
                Відмінити
              </Button>
              <Button type="primary" htmlType="submit" className={classes.buttons}>
                Опублікувати
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};


export default AddNewKadraForm;
