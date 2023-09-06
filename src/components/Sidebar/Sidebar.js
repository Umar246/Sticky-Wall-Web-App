import React, { useState } from 'react';
import Routes from '../../pages/Frontend/Routes';
import { AiOutlineDoubleRight, AiOutlineMenu, AiOutlinePlus, AiOutlineProfile } from 'react-icons/ai';
import { MdOutlineDateRange } from 'react-icons/md';
import { CiLogout } from 'react-icons/ci';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, theme, message } from 'antd';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useAuthContext } from '../../contexts/AuthContext';
import {PiBag} from 'react-icons/pi'
import {AiOutlineArrowRight,AiOutlineHome} from 'react-icons/ai'
import {BsPerson} from 'react-icons/bs'


const { Header, Sider, Content } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showListForm, setShowListForm] = useState('');
  const { setIsAuthenticated } = useAuthContext()

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Hide List Form (Custom)
  const handleListForm = () => {
    setShowListForm((current) => !current);
  };
  // HandleLogout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        message.success('Log Out Successfull')
        setIsAuthenticated(false)
      }).catch((error) => {
        message.error('Log Out not Successfull')

      });
  }

  return (
    <Layout>

      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className="demo-logo-vertical mt-3" />
        <div className="d-flex flex-column vh-100">
          <div>
            <h4 className="px-3">Menu</h4>
            <h5 className="px-3 mt-4 mb-0">Task</h5>
            <Menu
              style={{ marginTop: '10px', marginBottom: '0px' }}
              mode="inline"
              defaultSelectedKeys={['1']}
              items={[
                {
                  key: '1',
                  icon: <AiOutlineProfile />,
                  label: <Link to={'/'} style={{ textDecoration: 'none' }}> <span className='d-none d-md-inline'>StickyWall</span> </Link>,
                },
                {
                  key: '2',
                  icon: <AiOutlineMenu />,
                  label: <Link to={'/today'} style={{ textDecoration: 'none' }}> <span className='d-none d-md-inline'>Today</span> </Link>,
                },
                {
                  key: '3',
                  icon: <MdOutlineDateRange />,
                  label: <Link to={'/calendar'} style={{ textDecoration: 'none' }}> <span className='d-none d-md-inline'>Calebdar</span> </Link>,
                },
                {
                  key: '4',
                  icon: <AiOutlineDoubleRight />,
                  label: <Link to={'/upcoming'} style={{ textDecoration: 'none' }}> <span className='d-none d-md-inline'>Upcoming</span></Link>,
                },
              ]}
            />
          </div>

          {/* List Heading Custom */}
          {/* <div className="row">
            <div className="col">
              <h5 className="px-3">List</h5>
            </div>
          </div>

          Add new List Form

          <div className="row">
            <div className="col">
              <ul style={{ listStyle: 'none', fontSize: '14px' }} className='Lists nav nav-pills flex-column px-1'>

                <li className='nav-item   ps-3'>
                  <Link to='/list/office'  style={{ marginTop: '10px', marginBottom: '0px' }} className='nav-link text-decoration-none text-secondary py-1'>
                    <PiBag size={14}/>
                    <span className='ms-2 d-none d-md-inline'>{!collapsed && ' Office'}</span>
                  </Link>
                </li>
              
                <li className='nav-item   ps-3'>
                  <Link to='/list/homeTodos' style={{ marginTop: '10px', marginBottom: '0px' }} className='nav-link text-decoration-none text-secondary py-1'>
                    <AiOutlineHome/>
                    <span className='ms-2 d-none d-md-inline'> {!collapsed && ' Home'}</span>
                  </Link>
                </li>
               
                <li className='nav-item   ps-3'>
                  <Link to={'/list/personal'} style={{ marginTop: '10px', marginBottom: '0px' }} className='nav-link text-decoration-none text-secondary py-1'>
                    <BsPerson/>
                    <span className='ms-2 d-none d-md-inline'> {!collapsed && ' Personal'}</span>
                  </Link>
                </li>
              
                <li className='nav-item ps-3'>
                  <Link to={'/list/other'} style={{ marginTop: '10px', marginBottom: '0px' }} className='nav-link text-decoration-none text-secondary py-1'>
                    <AiOutlineArrowRight/>
                    <span className='ms-2 d-none d-md-inline'> {!collapsed && ' Other'}</span>
                  </Link>
                </li>

              

              </ul>

            </div>
          </div>

 */}

          {/* Logout Button Custom */}
          <div className="mb-2 mt-auto text-center ">

            <Link to={'/auth/login'} onClick={handleLogout} className="btn btn-outline-danger w-75  mb-3">
              <CiLogout /> <span className='d-none d-md-inline'>{collapsed === false && "Logout"}</span>
            </Link>
          </div>


        </div>


      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >


          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '30px',
              width: 64,
              height: 64,
            }}
          />


        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Routes />
        </Content>
      </Layout>
    </Layout>
  );
};
export default Sidebar;