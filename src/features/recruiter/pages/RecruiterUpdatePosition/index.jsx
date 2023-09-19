import {
	CheckCircleTwoTone,
	ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
	Button,
	Col,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Modal,
	Row,
	Select,
	Skeleton,
} from "antd";
import recruiterApi from "api/recruiterApi";
import dayjs from "dayjs";
import { authSelectors } from "features/auth/authSlice";
import { publicSelectors } from "features/public/publicSlice";
import { recruiterActions } from "features/recruiter/recruiterSlice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./RecruiterUpdatePositon.scss";

const { TextArea } = Input;
const dateFormat = "DD/MM/YYYY";

const onFinishFailed = (errorInfo) => {
	console.log("Failed:", errorInfo);
};

const handleChange = (value) => {
	console.log(`selected ${value}`);
};

export default function RecruiterUpdatePosition() {
	const [data, setData] = useState();
	const { currentUser } = useSelector(authSelectors);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { skills } = useSelector(publicSelectors);
	const { positions } = useSelector(publicSelectors);
	const { levels } = useSelector(publicSelectors);

	const { positionId } = useParams();

	const fetchData = useCallback(async () => {
		try {
			const resData = await recruiterApi.getPositionById(positionId);
			setData(resData);
		} catch (error) {
			console.log(error);
		}
	}, [positionId]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const confirm = () => {
		Modal.confirm({
			title: "Cancel",
			icon: <ExclamationCircleOutlined />,
			content: "Hủy việc chỉnh sửa vị trí tuyển dụng?",
			okText: "Có",
			cancelText: "Không",
			onOk: () => navigate("/recruiter"),
		});
	};

	const onSubmit = async (values) => {
		const newValues = {
			...values,
			id: values.id,
			benefit: values.benefit,
			description: values.description,
			startDate: values.startDate,
			endDate: values.endDate,
			referenceInformation: values.referenceInformation,
			requirements: values.requirements,
			salary: values.salary,
			status: 1,
			totalNeeded: values.totalNeeded,
			remainingNeeded: values.remainingNeeded,
			workingLocation: values.workingLocation,
			recruiter: currentUser,
			position: {
				id: values.position.value,
			},
			skill: values.skill.map((item) => {
				return {
					id: item.value,
				};
			}),
			level: values.level.map((item) => {
				return {
					id: item.value,
				};
			}),
		};


		try {
			await recruiterApi.updatePosition(newValues);

			dispatch(recruiterActions.getPositions({ page: 1, limit: 200 }));
			setTimeout(() => {
				navigate(`/recruiter`);
			}, 2000);
			Modal.confirm({
				title: "Success",
				icon: <CheckCircleTwoTone />,
				content: "Chỉnh sửa vị trí tuyển dụng thành công! ",
				onOk() { },
				cancelButtonProps: {
					style: {
						display: "none",
					},
				},
			});
		} catch (error) {
			console.log("add failed");
			Modal.confirm({
				title: "Failed",
				content: "Xảy ra lỗi chỉnh sửa không thành công ",
				onOk() { },
				cancelButtonProps: {
					style: {
						display: "none",
					},
				},
			});
		}
	};

	return !data ? (
		<Skeleton active style={{ margin: "2rem" }} />
	) : (
		<div className="RecruiterUpdatePosition internal-container">
			{skills && positions && levels && (
				<div className="container">
					<h2>Chỉnh sửa thông tin tuyển dụng</h2>
					<Form
						name="basic"
						labelCol={{ span: 8 }}
						wrapperCol={{ span: 16 }}
						onFinish={onSubmit}
						onFinishFailed={onFinishFailed}
						autoComplete="off"
						initialValues={{
							id: data.id,
							benefit: data.benefit,
							description: data.description,
							startDate: dayjs(data.startDate, "YYYY-MM-DD"),
							endDate: dayjs(data.endDate, "YYYY-MM-DD"),
							referenceInformation: data.referenceInformation,
							requirements: data.requirements,
							salary: data.salary,
							status: data.status,
							totalNeeded: data.totalNeeded,
							remainingNeeded: data.remainingNeeded,
							workingLocation: data.workingLocation,
							recruiter: {
								id: currentUser.id,
							},
							position: {
								value: data.position.id,
								label: data.position.name,
							},
							skill: data.skill.map((item) => {
								return {
									value: item.id,
									label: item.name,
								};
							}),
							level: data.level.map((item) => {
								return {
									value: item.id,
									label: item.name,
								};
							}),
						}}
					>
						<Form.Item
							labelCol={{ span: 4 }}
							wrapperCol={{ span: 20 }}
							label="id"
							name="id"
							style={{ display: "none" }}
						>
							<Input></Input>
						</Form.Item>
						<Form.Item
							labelCol={{ span: 4 }}
							wrapperCol={{ span: 20 }}
							label="Vị Trí Tuyển Dụng"
							name="position"
							rules={[
								{
									required: true,
									message: "Nhập Vị Trí Tuyển Dụng!",
								},
							]}
						>
							<Select
								allowClear
								style={{
									width: "100%",
								}}
								placeholder="Please select"
								onChange={handleChange}
								options={positions.map((position) => ({
									value: position.id,
									label: position.name,
								}))}
							/>
						</Form.Item>
						<Form.Item
							labelCol={{ span: 4 }}
							wrapperCol={{ span: 20 }}
							label="Kỹ năng yêu cầu"
							name="skill"
							rules={[
								{
									required: true,
									message: "Chọn kỹ năng yêu cầu!",
								},
							]}
						>
							<Select
								mode="multiple"
								allowClear
								style={{
									width: "100%",
								}}
								placeholder="Please select"
								onChange={handleChange}
								options={skills.map((skill) => ({
									value: skill.id,
									label: skill.name,
								}))}
							/>
						</Form.Item>
						<Row>
							<Col span="12">
								<Form.Item
									label="Level"
									name="level"
									rules={[
										{
											required: true,
											message: "Chọn Level cần tuyển!",
										},
									]}
								>
									<Select
										mode="multiple"
										allowClear
										style={{
											width: "100%",
										}}
										placeholder="Please select"
										onChange={handleChange}
										options={levels.map((level) => ({
											value: level.id,
											label: level.name,
										}))}
									/>
								</Form.Item>
							</Col>
							<Col span="12">
								<Form.Item
									wrapperCol={{ span: 16 }}
									label="Số Lượng Tuyển"
									name="totalNeeded"
									rules={[
										{
											required: true,
											message: "Nhập số người cần tuyển!",
										},
									]}
								>
									<InputNumber
										min={1}
										style={{
											width: "100%",
										}}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span="12">
								<Form.Item
									label="Mức lương"
									name="salary"
									rules={[
										{
											required: true,
											message: "Nhập Mức lương!",
										},
									]}
								>
									<InputNumber
										min={1}
										style={{
											width: "100%",
										}}
									/>
								</Form.Item>
							</Col>
							<Col span="12">
								<Form.Item
									wrapperCol={{ span: 16 }}
									label="Số Lượng còn thiếu"
									name="remainingNeeded"
									rules={[
										{
											required: true,
											message: "Nhập số người còn thiếu!",
										},
									]}
								>
									<InputNumber
										min={1}
										style={{
											width: "100%",
										}}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span="12">
								<Form.Item
									label="Nơi làm việc"
									name="workingLocation"
									rules={[
										{
											required: true,
											message: "Nhập Nơi làm việc!",
										},
									]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col span="12">
								<Form.Item
									label="Ngày bắt đầu"
									name="startDate"
									rules={[
										{
											required: true,
											message: "Nhập ngày bắt đầu!",
										},
									]}
								>
									<DatePicker
										style={{
											width: "100%",
										}}
										format={dateFormat}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span="12">
								<Form.Item
									label="Trạng thái"
									name="status"
									rules={[
										{
											required: true,
											message: "Nhập trạng thái!",
										},
									]}
								>
									<Input disabled />
								</Form.Item>
							</Col>
							<Col span="12">
								<Form.Item
									label="Ngày kết thúc"
									name="endDate"
									rules={[
										{
											required: true,
											message: "Nhập hạn ứng tuyển!",
										},
									]}
								>
									<DatePicker
										style={{
											width: "100%",
										}}
										format={dateFormat}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span="12">
								<Form.Item
									label="Mô Tả"
									name="description"
									rules={[
										{
											required: true,
											message: "Nhập mô tả công việc!",
										},
									]}
								>
									<TextArea rows={4} />
								</Form.Item>
							</Col>
							<Col span="12">
								<Form.Item
									label="Yêu cầu tuyển dụng"
									name="requirements"
									rules={[
										{
											required: true,
											message: "Nhập Yêu cầu ứng tuyển!",
										},
									]}
								>
									<TextArea rows={4} />
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span="12">
								<Form.Item
									label="Quyền lợi"
									name="benefit"
									rules={[
										{
											required: true,
											message: "Nhập quyền lợi được hưởng!",
										},
									]}
								>
									<TextArea rows={4} />
								</Form.Item>
							</Col>
							<Col span="12">
								<Form.Item
									label="Thông tin tham khảo"
									name="referenceInformation"
									rules={[
										{
											required: true,
											message: "Nhập thông tin tham khảo!",
										},
									]}
								>
									<TextArea rows={4} />
								</Form.Item>
							</Col>
						</Row>
						<Form.Item
							wrapperCol={{
								offset: 11,
								span: 12,
							}}
						>
							<Button
								type="primary"
								danger
								onClick={() => {
									confirm();
								}}
							>
								Cancel
							</Button>
							<Button type="primary" htmlType="submit">
								Save
							</Button>
						</Form.Item>
					</Form>
				</div>
			)}
		</div>
	);
}
