import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

export default function CreateEvent() {

    const [value, setValue] = useState({
        duong_dan_hinh_anh: "",
        ten_su_kien: "",
        thoi_gian_dien_ra_su_kien: "",
        dia_diem: "",
        loai_su_kien: "",
        mo_ta: ""
    });

    const [selectedDate, setSelectedDate] = useState(new Date());

    const navigate = useNavigate();

    const handleChange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedDate) {
            value.thoi_gian_dien_ra_su_kien = format(selectedDate, 'dd/MM/yyyy')
        }

        // Kiểm tra các trường không được để trống
        if (!value.duong_dan_hinh_anh || !value.ten_su_kien || !value.dia_diem || !value.thoi_gian_dien_ra_su_kien) {
            alert('Vui lòng điền tất cả các trường.');
            return;
        }

        try {
            const createevent = await axios.post('https://web-lichsukien.onrender.com/api/create', value);
            const response = createevent.data;
            if (response.success) {
                alert(response.Message);
                navigate('/');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='container my-4'>
            <div className='row'>
                <div className='col-md-8 mx-auto rounded border p-4'>
                    <h2 className='text-center mb-5'>Thêm sự kiện</h2>

                    <form onSubmit={handleSubmit}>
                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Đường dẫn hình ảnh</label>
                            <div className='col-sm-8'>
                                <input className='form-control' name='duong_dan_hinh_anh' onChange={handleChange} value={value.duong_dan_hinh_anh} />
                            </div>
                        </div>

                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Tiêu đề sự kiện</label>
                            <div className='col-sm-8'>
                                <input className='form-control' name='ten_su_kien' onChange={handleChange} value={value.ten_su_kien} />
                            </div>
                        </div>

                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Loại sự kiện</label>
                            <div className='col-sm-8'>
                                <select className='form-select' name='loai_su_kien' onChange={handleChange} value={value.loai_su_kien}>
                                    <option value=''>Chọn loại sự kiện</option>
                                    <option value='Lễ hội - Vui chơi'>Lễ hội - Vui chơi</option>
                                    <option value='Văn hóa - Xã hội'>Văn hóa - Xã hội</option>
                                    <option value='Chính trị'>Chính trị</option>
                                    <option value='Giáo dục - Thể thao'>Giáo dục - Thể thao</option>
                                </select>
                            </div>
                        </div>

                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Thời gian diễn ra sự kiện</label>
                            <div className='col-sm-8'>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={date => setSelectedDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="dd/MM/yyyy"
                                    className='form-control'
                                />
                            </div>
                        </div>

                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Địa điểm tổ chức sự kiện</label>
                            <div className='col-sm-8'>
                                <input className='form-control' name='dia_diem' onChange={handleChange} value={value.dia_diem} />
                            </div>
                        </div>

                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Mô tả</label>
                            <div className='col-sm-8'>
                                <textarea className='form-control' name='mo_ta' onChange={handleChange} value={value.mo_ta} style={{ height: 300 }} />
                            </div>
                        </div>

                        <div className='row'>
                            <div className='offset-sm-4 col-sm-4 d-grid'>
                                <button type='submit' className='btn btn-primary'>Xác nhận</button>
                            </div>
                            <div className='col-sm-4 d-grid'>
                                <Link className='btn btn-secondary' to='/' role='button'>Quay lại</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}