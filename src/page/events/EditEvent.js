import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse } from 'date-fns';
import './style.css'

export default function EditEvent({ showModal, handleClose, eventId }) {
    const [value, setValue] = useState({
        duong_dan_hinh_anh: "",
        ten_su_kien: "",
        thoi_gian_dien_ra_su_kien: "",
        dia_diem: "",
        loai_su_kien: "",
        mo_ta: ""
    });
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!eventId) return;
        async function fetchEvent() {
            try {
                const response = await axios.get(`https://web-lichsukien.onrender.com/api/get/${eventId}`); // Lấy dữ liệu của sự kiện với ID tương ứng
                const event = response.data.event;

                // Chuyển đổi thời gian diễn ra sự kiện thành đối tượng Date
                const eventDate = parse(event.thoi_gian_dien_ra_su_kien, 'dd/MM/yyyy', new Date());

                setValue({
                    duong_dan_hinh_anh: event.duong_dan_hinh_anh,
                    ten_su_kien: event.ten_su_kien,
                    thoi_gian_dien_ra_su_kien: format(eventDate, 'dd/MM/yyyy'), // Định dạng ngày khi gán vào state
                    dia_diem: event.dia_diem,
                    loai_su_kien: event.loai_su_kien,
                    mo_ta: event.mo_ta
                });
                setSelectedDate(eventDate);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        fetchEvent();
    }, [eventId]);

    const handleChange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        });
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setValue({
            ...value,
            thoi_gian_dien_ra_su_kien: format(date, 'dd/MM/yyyy') // Cập nhật định dạng ngày trong state
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra các trường không được để trống
        if (!value.duong_dan_hinh_anh || !value.ten_su_kien || !value.dia_diem || !value.thoi_gian_dien_ra_su_kien) {
            alert('Vui lòng điền tất cả các trường.');
            return;
        }

        try {
            const response = await axios.put(`https://web-lichsukien.onrender.com/api/update/${eventId}`, value);
            if (response.data.success) {
                alert(response.data.message);
                navigate('/'); // Chuyển hướng về trang danh sách sự kiện
                handleClose();
            }
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Không thể cập nhật sự kiện.');
        }
    };

    if (loading) {
        return (
            <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className={`overlay ${showModal ? 'd-block' : 'd-none'}`}></div>
            <div className={`modal ${showModal ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Chỉnh sửa sự kiện</h5>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>

                                <div className='row mb-3'>
                                    <div className='col-sm-12 text-center'>
                                        <img src={value.duong_dan_hinh_anh} alt="" style={{ maxHeight: '100px', }} className='mt-3' />
                                    </div>
                                </div>

                                <div className='form-group mt-2'>
                                    <label>Đường dẫn hình ảnh</label>
                                    <div>
                                        <input
                                            className='form-control mt-2'
                                            name='duong_dan_hinh_anh'
                                            onChange={handleChange}
                                            value={value.duong_dan_hinh_anh}
                                        />
                                    </div>
                                </div>

                                <div className='form-group mt-2'>
                                    <label>Tiêu đề sự kiện</label>
                                    <div>
                                        <input
                                            className='form-control mt-2'
                                            name='ten_su_kien'
                                            onChange={handleChange}
                                            value={value.ten_su_kien}
                                        />
                                    </div>
                                </div>

                                <div className='form-group mt-2'>
                                    <label>Loại sự kiện</label>
                                    <div>
                                        <select
                                            className='form-select'
                                            name='loai_su_kien'
                                            onChange={handleChange}
                                            value={value.loai_su_kien}
                                        >
                                            <option value='Lễ hội - Vui chơi'>Lễ hội - Vui chơi</option>
                                            <option value='Văn hóa - Xã hội'>Văn hóa - Xã hội</option>
                                            <option value='Chính trị'>Chính trị</option>
                                            <option value='Giáo dục - Thể thao'>Giáo dục - Thể thao</option>
                                        </select>
                                    </div>
                                </div>

                                <div className='form-group mt-2'>
                                    <label>Thời gian diễn ra sự kiện</label>
                                    <div>
                                        <DatePicker
                                            selected={selectedDate}
                                            onChange={handleDateChange}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="dd/MM/yyyy"
                                            className='form-control mt-2'
                                        />
                                    </div>
                                </div>

                                <div className='form-group mt-2'>
                                    <label>Địa điểm tổ chức sự kiện</label>
                                    <div>
                                        <input
                                            className='form-control mt-2'
                                            name='dia_diem'
                                            onChange={handleChange}
                                            value={value.dia_diem}
                                        />
                                    </div>
                                </div>

                                <div className='form-group mt-2'>
                                    <label>Mô tả</label>
                                    <div>
                                        <textarea
                                            className='form-control mt-2'
                                            name='mo_ta'
                                            onChange={handleChange}
                                            value={value.mo_ta}
                                            style={{ height: 300 }}
                                        />
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type='submit' className='btn btn-primary'>Xác nhận</button>
                                    <button type="button" className="btn btn-secondary" onClick={handleClose}>Đóng</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
