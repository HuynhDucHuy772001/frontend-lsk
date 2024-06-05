import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import EditEvent from './EditEvent';
import './style.css'

export default function EventList() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const fetchEvent = await axios.get('https://web-lichsukien.onrender.com/api/get');
            const response = fetchEvent.data;
            console.log(response);
            setData(response);
        } catch (error) {
            console.log("Không thể kết nối đến máy chủ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
            try {
                const response = await axios.delete(`https://web-lichsukien.onrender.com/api/delete/${id}`);
                if (response.data.success) {
                    alert(response.data.message);
                    fetchData(); // Tải lại danh sách sự kiện sau khi xóa thành công
                } else {
                    alert('Không thể xóa sự kiện.');
                }
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Không thể xóa sự kiện.');
            }
        }
    };

    function handleEdit(id) {
        setSelectedEventId(id);
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
        setSelectedEventId(null);
        fetchData(); // Refresh the list after closing the modal
    }

    return (
        <div className='container my-4'>
            <h2 className='text-center mb-4'>Danh sách các sự kiện</h2>

            <div className='row mb-3'>
                <div className='col'>
                    <Link className='btn btn-primary me-1' to='/create' role='button'>Thêm sự kiện mới</Link>
                    <button type='button' className='btn btn-outline-primary' onClick={fetchData} >Tải lại</button>
                </div>
            </div>
            {loading ? ( // Hiển thị spinner khi đang tải dữ liệu
                <div className='text-center'>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <table className='table table-striped table-bordered'>
                    <thead>
                        <tr>
                            <th className='text-center align-middle'>Hình ảnh</th>
                            <th className='text-center align-middle'>Tiêu đề sự kiện</th>
                            <th className='text-center align-middle'>Loại sự kiện</th>
                            <th className='text-center align-middle'>Thời gian diễn ra sự kiện</th>
                            <th className='text-center align-middle'>Địa điểm tổ chức sự kiện</th>
                            <th className='text-center align-middle'>Mô tả</th>
                            <th className='text-center align-middle'>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.events?.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className='text-center align-middle'>
                                        <img src={item.duong_dan_hinh_anh} alt="Event" style={{ width: '150px', height: '100px' }} />
                                    </td>
                                    <td className='text-center align-middle'>{item.ten_su_kien}</td>
                                    <td className='text-center align-middle'>{item.loai_su_kien}</td>
                                    <td className='text-center align-middle'>{item.thoi_gian_dien_ra_su_kien}</td>
                                    <td className='text-center align-middle' style={{ width: '15%' }}>{item.dia_diem}</td>
                                    <td className='text-left line-clamp-scroll'>{item.mo_ta}</td>
                                    <td style={{ width: "10px", whiteSpace: 'nowrap' }} className='align-center align-middle'>
                                        <button className='btn btn-primary btn-sm me-1' onClick={() => handleEdit(item._id)}>Chỉnh sửa</button>
                                        <button type='button' className='btn btn-danger btn-sm' onClick={() => handleDelete(item._id)}>Xóa</button>
                                    </td>
                                </tr>
                            )
                        })}


                    </tbody>
                </table>
            )}
            {showModal && (
                <EditEvent
                    showModal={showModal}
                    handleClose={handleCloseModal}
                    eventId={selectedEventId}
                />
            )}
        </div>
    )

}
