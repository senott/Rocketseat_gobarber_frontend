import React, { ChangeEvent, useCallback, useRef } from 'react';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import { Container, Content, AvatarInput } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  current_password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          current_password: Yup.string(),
          password: Yup.string().when('current_password', {
            is: val => !!val.length,
            then: Yup.string().min(6, 'No mínimo 6 dígitos'),
            otherwise: Yup.string().min(0),
          }),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password')],
            'Senhas digitadas não são iguais.',
          ),
        });

        await schema.validate(data, { abortEarly: false });

        const {
          name,
          email,
          current_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(current_password
            ? { current_password, password, password_confirmation }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data.user);

        history.push('/dashboard');

        addToast({
          type: 'success',
          title: 'Perfil atualizado com sucesso!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização',
          description:
            'Ocorreu um erro ao atualizar o usuário, verifique as informações enviadas.',
        });
      }
    },
    [history, addToast, updateUser],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const data = new FormData();

        data.append('avatar', e.target.files[0]);

        api.patch('/users/avatar', data).then(response => {
          updateUser(response.data.user);

          addToast({ type: 'success', title: 'Avatar alterado com sucesso!' });
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          initialData={{ name: user.name, email: user.email }}
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input
                type="file"
                id="avatar"
                onChange={handleAvatarChange}
                data-testid="avatar"
              />
            </label>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="current_password"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
          />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova senha"
          />
          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirmação senha"
          />

          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
