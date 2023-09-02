import React, { useState } from 'react';

import Routes from '../../pages/Frontend/Routes'

import { AiOutlineDoubleRight, AiOutlineMenu, AiOutlinePlus, AiOutlineProfile } from 'react-icons/ai'
import { MdOutlineDateRange } from 'react-icons/md'
import { CiLogout } from 'react-icons/ci'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,

  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import { Link } from 'react-router-dom';


const { Header, Sider, Content } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showListForm, setShowListForm] = useState('')

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Hide List Form (Custom)
  const handleListForm = () => {
    setShowListForm(current => !current)
  }

  return (
    <Layout >
      <Sider trigger={null} collapsible collapsed={collapsed} theme='light'>
        <div className="demo-logo-vertical mt-3" />
        <div className=' d-flex flex-column  vh-100'>
          <div>
            <h4 className='px-3'>Menu</h4>
            <h5 className='px-3 mt-4 mb-0'>Task</h5>
            <Menu
              style={{ marginTop: '10px', marginBottom: '0px' }}
              mode="inline"
              defaultSelectedKeys={['1']}
              items={[
                {

                  key: '1',
                  icon: <AiOutlineProfile />,
                  label: <Link to={'/'} style={{ textDecoration: 'none' }}>StickyWall</Link>,
                },
                {
                  key: '2',
                  icon: <AiOutlineMenu />,
                  label: <Link to={'/today'} style={{ textDecoration: 'none' }}>Today</Link>,
                },
                {
                  key: '3',
                  icon: <MdOutlineDateRange />,
                  label: <Link to={'/celendar'} style={{ textDecoration: 'none' }}>Celendar</Link>,
                },
                {
                  key: '4',
                  icon: <AiOutlineDoubleRight />,
                  label: <Link to={'/upcoming'} style={{ textDecoration: 'none' }}>Upcoming</Link>,
                },
              ]}
            />
          </div>

          {/* List Heading Custom */}
          <div className="row">
            <div className="col">
              <h5 className='px-3'>List</h5>
            </div>
          </div>

          {/* Add new List Form */}


          <div className="row">
            <div className="col text-center">


              <button className='btn btn-light  w-75' onClick={handleListForm}>  <AiOutlinePlus size={18} /> <span>{collapsed == false && 'Add New List'} </span> </button>

              <form className={`${showListForm ? "d-block" : "d-none"} mt-3 overflow-hide`}>

                <div className="row">

                  <div className="col-12 col-md-8 me-0 ">
                    <input type="text" className='form-control form-control-sm ms-2 mb-sm-2 me-0' placeholder='New List Name' />
                  </div>

                  <div className="col">
                    <input type="color" className='form-control form-control-sm ms-sm-2 ms-md-0 form-control-color' />
                  </div>

                  <div className="col">
                    <button className='btn btn-outline-success btn-sm w-75 mt-2'>{collapsed==false ? 'Add' :  <AiOutlinePlus />}</button>
                  </div>

                </div>

              </form>

            </div>
          </div>





          {/* Logout Button Custom */}

          <div className=' mb-2 mt-auto text-center '>
            <hr />
            <button className=' btn btn-outline-danger w-75  mb-3'><CiLogout />  <span>{collapsed==false && "Logout"}</span> </button>
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
              fontSize: '16px',
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

