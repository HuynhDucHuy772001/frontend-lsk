import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

export default function CreateEvent() {
    const [value, setValue] = useState({
        ten_su_kien: "",
        ngay_dien_ra_su_kien: "",
        thoi_gian_dien_ra_su_kien: "",
        dia_diem: {
            dia_chi: "",
            link_ban_do: ""
        },
        gia_ve: {
            loai_gia_ve: "Miễn phí",
            so_tien: 0
        },
        hinh_anh: "",
        clip_gioi_thieu: "",
        linh_vuc: "",
        bai_viet: "",
        nguon: "",
        don_vi_to_chuc: {
            logo: "",
            ten: "",
            thong_tin_lien_he: {
                sdt: "",
                website: ""
            }
        }
    });

    const [ticketType, setTicketType] = useState('Miễn phí');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        if (keys.length === 1) {
            setValue(prevState => ({ ...prevState, [name]: value }));
        } else if (keys.length === 2) {
            setValue(prevState => ({
                ...prevState,
                [keys[0]]: {
                    ...prevState[keys[0]],
                    [keys[1]]: value
                }
            }));
        } else if (keys.length === 3) {
            setValue(prevState => ({
                ...prevState,
                [keys[0]]: {
                    ...prevState[keys[0]],
                    [keys[1]]: {
                        ...prevState[keys[0]][keys[1]],
                        [keys[2]]: value
                    }
                }
            }));
        }
    };

    const handleTicketTypeChange = (event) => {
        const newTicketType = event.target.value;
        setTicketType(newTicketType);
        if (newTicketType === 'Miễn phí') {
            setValue(prevState => ({
                ...prevState,
                gia_ve: {
                    loai_gia_ve: 'Miễn phí',
                    so_tien: 0
                }
            }));
        } else {
            setValue(prevState => ({
                ...prevState,
                gia_ve: {
                    loai_gia_ve: 'Có phí',
                    so_tien: prevState.gia_ve.so_tien || 0
                }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedDate = selectedDate ? format(selectedDate, 'dd/MM/yyyy') : "";

        // Chuyển đổi chuỗi ngày thành đối tượng Date
        const dateParts = formattedDate.split('/');
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Tháng bắt đầu từ 0
        const year = parseInt(dateParts[2], 10);

        const eventDate = new Date(year, month, day);
        const timestamp = eventDate.getTime();

        const updatedValue = {
            ...value,
            ngay_dien_ra_su_kien: timestamp
        };

        try {
            const createevent = await axios.post('https://web-lichsukien.onrender.com/api/create/', updatedValue);
            const response = createevent.data;
            if (response.success) {
                alert(response.message);
                navigate('/');
            }
        } catch (error) {
            console.log(error);
            alert('Failed to create event.');
        }
    };

    return (
        <div className='container my-4'>
            <div className='row'>
                <div className='col-md-8 mx-auto rounded border p-4'>
                    <h2 className='text-center mb-5'>Thêm sự kiện</h2>

                    <form onSubmit={handleSubmit}>
                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Đường dẫn hình ảnh<label style={{ color: 'red' }}>*</label></label>
                            <div className='col-sm-8'>
                                <input className='form-control' name='hinh_anh' onChange={handleChange} value={value.hinh_anh} />
                            </div>
                        </div>

                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>ID video từ youtube<label style={{ color: 'red' }}>*</label></label>
                            <div className='col-sm-8'>
                                <input className='form-control' name='clip_gioi_thieu' onChange={handleChange} value={value.clip_gioi_thieu} />
                                <label style={{ fontSize: 13 }} >Hướng dẫn: Vd link youtube là https://www.youtube.com/watch?v=tB3sRJBC93M thì ID sẽ là: tB3sRJBC93M</label>
                            </div>
                        </div>

                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Tiêu đề sự kiện<label style={{ color: 'red' }}>*</label></label>
                            <div className='col-sm-8'>
                                <input className='form-control' name='ten_su_kien' onChange={handleChange} value={value.ten_su_kien} />
                            </div>
                        </div>

                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Lĩnh Vực<label style={{ color: 'red' }}>*</label></label>
                            <div className='col-sm-8'>
                                <select className='form-select' name='linh_vuc' onChange={handleChange} value={value.linh_vuc}>
                                    <option value=''>Chọn loại sự kiện</option>
                                    <option value='Lễ hội truyền thống'>Lễ hội truyền thống</option>
                                    <option value='Thể thao'>Thể thao</option>
                                    <option value='Văn hóa - Nghệ thuật'>Văn hóa - Nghệ thuật</option>
                                    <option value='Chính trị - Ngoại giao'>Chính trị - Ngoại giao</option>
                                    <option value='Hội thảo chuyên ngành'>Hội thảo chuyên ngành</option>
                                    <option value='Khác'>Khác</option>
                                </select>
                            </div>
                        </div>

                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Ngày diễn ra sự kiện<label style={{ color: 'red' }}>*</label></label>
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
                            <label className='col-sm-4 col-form-label'>Thời gian:</label>
                            <div className='col-sm-3'>
                                <input className='form-control' name='thoi_gian_dien_ra_su_kien' placeholder="HH:mm - HH:mm" onChange={handleChange} value={value.thoi_gian_dien_ra_su_kien} />
                            </div>
                        </div>

                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Địa điểm tổ chức sự kiện<label style={{ color: 'red' }}>*</label></label>
                            <div className='col-sm-8'>
                                <input className='form-control' name='dia_diem.dia_chi' onChange={handleChange} value={value.dia_diem.dia_chi} />
                            </div>
                        </div>

                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Link bản đồ<label style={{ color: 'red' }}>*</label></label>
                            <div className='col-sm-8'>
                                <input className='form-control' name='dia_diem.link_ban_do' onChange={handleChange} value={value.dia_diem.link_ban_do} />
                            </div>
                        </div>

                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Loại vé<label style={{ color: 'red' }}>*</label></label>
                            <div className='col-sm-3'>
                                <select className='form-select' value={ticketType} name='gia_ve.loai_ve' onChange={handleTicketTypeChange}>
                                    <option value="Miễn phí">Miễn phí</option>
                                    <option value="Có phí">Có phí</option>
                                </select>
                            </div>
                            {ticketType === 'Có phí' && (
                                <div className='col d-flex align-items-center'>
                                    <label className='col-sm-3 col-form-label mb-0'>Số tiền<label style={{ color: 'red' }}>*</label></label>
                                    <div className='col-sm-8'>
                                        <input className='form-control' name='gia_ve.so_tien' onChange={handleChange} value={value.gia_ve.so_tien} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Nguồn<label style={{ color: 'red' }}>*</label></label>
                            <div className='col-sm-8'>
                                <input className='form-control' name='nguon' onChange={handleChange} value={value.nguon} />
                            </div>
                        </div>

                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Tên đơn vị tổ chức</label>
                            <div className='col-sm-8'>
                                <input className='form-control' name='don_vi_to_chuc.ten' onChange={handleChange} value={value.don_vi_to_chuc.ten} />
                            </div>
                        </div>

                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Logo đơn vị tổ chức</label>
                            <div className='col-sm-8'>
                                <input className='form-control' name='don_vi_to_chuc.logo' onChange={handleChange} value={value.don_vi_to_chuc.logo} />
                            </div>
                        </div>

                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Số điện thoại liên hệ</label>
                            <div className='col-sm-8'>
                                <input className='form-control' name='don_vi_to_chuc.thong_tin_lien_he.sdt' onChange={handleChange} value={value.don_vi_to_chuc.thong_tin_lien_he.sdt} />
                            </div>
                        </div>

                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Website đơn vị tổ chức</label>
                            <div className='col-sm-8'>
                                <input className='form-control' name='don_vi_to_chuc.thong_tin_lien_he.website' onChange={handleChange} value={value.don_vi_to_chuc.thong_tin_lien_he.website} />
                            </div>
                        </div>

                        <div className='row mb-3'>
                            <label className='col-sm-4 col-form-label'>Bài viết</label>
                            <div className='col-sm-8'>
                                <textarea className='form-control' name='bai_viet' onChange={handleChange} value={value.bai_viet} style={{ height: 300 }} />
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
