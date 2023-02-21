import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Member } from '../contexts/store';

const MemberPage = () => {

    let { userId } = useParams();

    // Where to fetch the data from (e.g. file path or proxy URL)
    const GET_MEMBER_ENDPOINT: string = `http://localhost:4000/getmember/${userId}`;

    const [member, setMember] = useState<Member>({
        id: '',
        name: '',
        isActive: '',
        tamidClass: '',
        majors: [],
        minors: [],
        graduationYear: '',
        hometown: '',
        instagram: '',
        linkedin: '',
        mbtiPersonality: [],
        birthday: '',
        mentorshipStatus: '',
        northeasternEmail: '',
        phoneNumber: '',
        picture: '',
        trackInvolvement: '',
        tamidChatsStatus: '',
        isGraduated: false
    });

    useEffect(() => {
        axios.get(GET_MEMBER_ENDPOINT, { withCredentials: true })
            .then((res) => {
                setMember(res.data)
                console.log(res.data)
                return res.data
            })
    }, [])

    return (
        <div>
            {userId}
            {member.hometown}
        </div>
    )
}

export default MemberPage