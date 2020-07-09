import React from 'react';
import { Form, Input, Button } from 'antd';
import styles from '../ChangePassword/ChangePassword.module.css';
import authorizeApi from '../../api/authorizeApi';
import { checkEmail, checkNameSurName } from '../SignUp/verification';

export default function () {
    const [form] = Form.useForm();

    const validationSchema = {
        CurrentPassword: [
            { required: true, message: "Поле пароль є обов'язковим" },
            { min: 6, message: 'Мінімальна допустима довжина - 6 символів' }
        ],
        NewPassword: [
            { required: true, message: "Поле пароль є обов'язковим" },
            { min: 6, message: 'Мінімальна допустима довжина - 6 символів' },
        ],
        ConfirmPassword: [
            { required: true, message: "Дане поле є обов'язковим" },
            { min: 6, message: 'Мінімальна допустима довжина - 6 символів' },
        ]
    };

    const handleSubmit = async (values: any) => {
        //await authorizeApi.register(values);
        console.log(values);
    };

    const initialValues = {
        Email: '',
        Password: '',
        ConfirmPassword: ''
    };

    return (
        <div className={styles.mainContainer}>
            <Form
                name="ChangePasswordForm"
                initialValues={initialValues}
                form={form}
                onFinish={handleSubmit}>

                <Form.Item name="CurrentPassword" rules={validationSchema.CurrentPassword}>
                    <Input.Password visibilityToggle={false} className={styles.ChangePasswordInput} placeholder="Поточний пароль" />
                </Form.Item>

                <Form.Item name="NewPassword" rules={validationSchema.NewPassword}>
                    <Input.Password visibilityToggle={false} className={styles.ChangePasswordInput} placeholder="Новий пароль" />
                </Form.Item>

                <Form.Item
                    name="ConfirmPassword"
                    dependencies={['NewPassword']}
                    rules={[
                        {
                            required: true,
                            message: 'Підтвердіть пароль',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('Password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Паролі не співпадають'));
                            },
                        }),
                    ]}
                >
                    <Input.Password visibilityToggle={false} className={styles.ChangePasswordInput} placeholder="Введіть новий пароль ще раз" />
                </Form.Item>

                <Form.Item>
                    <Button htmlType="submit" id={styles.confirmButton}>
                        Змінити пароль
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}