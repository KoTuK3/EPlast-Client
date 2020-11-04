import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "antd";
import notificationLogic from "./../../../components/Notifications/Notification";
import CityAdmin from "../../../models/City/CityAdmin";
import { addAdministrator } from "../../../api/citiesApi";
import AdminType from "../../../models/Admin/AdminType";

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: any) => void;
  onChange?: (id: string, userRoles: string) => void;
  admin: CityAdmin;
  cityId: number;
  adminType: any;
  startDate: any;
  endDate: any;
  endDayOld: any;
  oldAdminFirstName: string | undefined;
  oldAdminLastName: string | undefined;
  onAdd?: (admin?: CityAdmin) => void;
}
const ConfirmHeadAdminModal = ({
  visibleModal,
  setVisibleModal,
  onChange,
  admin,
  cityId,
  adminType,
  startDate,
  endDate,
  endDayOld,
  oldAdminFirstName,
  oldAdminLastName,
  onAdd,
}: Props) => {
  const handleCancel = () => {
    setVisibleModal(false);
  };

  const handleSubmit = async () => {
    let newAdmin: CityAdmin = {
      id: admin.id,
      adminType: {
        ...new AdminType(),
        adminTypeName: adminType,
      },
      cityId: cityId,
      user: admin.user,
      userId: admin.userId,
      endDate: endDate?._d,
      startDate: startDate?._d,
    };

    admin = (await addAdministrator(admin.cityId, newAdmin)).data;
    onAdd?.(admin);
    notificationLogic("success", "Користувач успішно доданий в провід");
    onChange?.(admin.userId, adminType);
    setVisibleModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {};
    fetchData();
  }, []);

  return (
    <Modal
      title="Увага!"
      visible={visibleModal}
      centered
      footer={null}
      onCancel={() => setVisibleModal(false)}
      onOk={handleSubmit}
    >
      <div>
        <Form>
          <div style={{ margin: 10 }}>
            {oldAdminFirstName} {oldAdminLastName} є Головою Станиці, термін дії
            посади закінчується{" "}
            {endDayOld === "Invalid date" ? "ще не скоро" : endDayOld}.
            Призначити даного користувача на цю посаду?
          </div>
          <Form.Item className="cancelConfirmButtons">
            <Row justify="end">
              <Col xs={11} sm={5}>
                <Button key="back" onClick={handleCancel}>
                  Відмінити
                </Button>
              </Col>
              <Col
                className="publishButton"
                xs={{ span: 11, offset: 2 }}
                sm={{ span: 6, offset: 1 }}
              >
                <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                  Призначити
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ConfirmHeadAdminModal;
