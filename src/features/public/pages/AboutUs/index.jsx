import './AboutUs.scss';
import avatar from 'assets/images/avatar-temp.jpg';
import { Layout, Space, Typography, Dropdown, Row, Col } from 'antd';
import {
	BankOutlined,
	SearchOutlined,
	HourglassOutlined,
} from '@ant-design/icons';

const items = [
	{
		label: 'Trang cá nhân',
		key: 'information',
	},
	{
		label: 'Quản lý CV',
		key: 'cv',
	},
	{
		label: 'Lịch sử phỏng vấn',
		key: 'interview',
	},
	{
		label: 'Đăng xuất',
		key: 'signout',
	},
];

const AboutUs = () => {
	return (
		<Layout className='AboutUs'>
			<Layout.Header className='header'>
				<div className='flex align-center gap-2'>
					<Typography.Title
						className='logo'
						level={3}>
						LOGO
					</Typography.Title>
					<ul className='flex gap-1'>
						<li>
							<Typography.Text className='menu'>TUYỂN DỤNG</Typography.Text>
						</li>
						<li>
							<Typography.Text className='menu'>SỰ KIỆN</Typography.Text>
						</li>
						<li>
							<Typography.Text className='menu'>TẠO CV</Typography.Text>
						</li>
					</ul>
				</div>
				<Space>
					<Dropdown menu={{ items }}>
						<div className='avatar'>
							<img
								src={avatar}
								width={32}
								height={32}
								alt=''
								style={{ borderRadius: '9999px' }}
							/>
							<Typography.Text
								className='name'
								level={4}>
								Thầy giáo Ba
							</Typography.Text>
						</div>
					</Dropdown>
				</Space>
			</Layout.Header>

			<section className='about-us'>
				<div className='polygon'>
					<div className='title-container'>
						<div>
							<Typography.Title
								className='title'
								level={1}>
								ABOUT US
							</Typography.Title>
							<Typography.Title
								className='company'
								level={2}>
								COMANY NAME
							</Typography.Title>
						</div>
					</div>
				</div>
			</section>

			<section className='outer why'>
				<div className='inner intro'>
					<Typography.Title
						level={2}
						className='why-title'>
						Why choose us
					</Typography.Title>
					<Typography.Text className='why-content'>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat. Duis aute irure dolor in
						reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
						pariatur
					</Typography.Text>
				</div>
			</section>

			<section className='outer'>
				<div className='inner flex align-center'>
					<div className='content'>
						<Typography.Title level={3}>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod
						</Typography.Title>
						<Typography.Text>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
							reprehenderit in voluptate velit esse cillum dolore eu fugiat
							nulla pariatur. <br />
						</Typography.Text>
						<Typography.Text>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat.
						</Typography.Text>{' '}
						<br />
						<Typography.Text>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat.
						</Typography.Text>
					</div>
					<div className='image-1'></div>
				</div>
			</section>

			<section className='outer'>
				<div className='inner'>
					<Typography.Title
						level={2}
						className='text-center row-title'>
						Lorem Ipsum Dolor
					</Typography.Title>
					<Row gutter={40}>
						<Col
							span={8}
							className='col'>
							<SearchOutlined className='icon' />
							<Typography.Title
								level={4}
								className='col-title'>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit
							</Typography.Title>
							<Typography.Text>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
								eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
								enim ad minim veniam.
							</Typography.Text>
						</Col>

						<Col
							span={8}
							className='col'>
							<BankOutlined className='icon' />
							<Typography.Title
								level={4}
								className='col-title'>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit
							</Typography.Title>
							<Typography.Text>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
								eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
								enim ad minim veniam.
							</Typography.Text>
						</Col>

						<Col
							span={8}
							className='col'>
							<HourglassOutlined className='icon' />
							<Typography.Title
								level={4}
								className='col-title'>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit
							</Typography.Title>
							<Typography.Text>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
								eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
								enim ad minim veniam.
							</Typography.Text>
						</Col>
					</Row>
				</div>
			</section>
		</Layout>
	);
};

export default AboutUs;
