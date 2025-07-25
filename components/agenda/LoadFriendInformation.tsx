import { useEffect, useState } from "react";
import Button from "../bootstrap/Button";
import { useDispatch } from "react-redux";
import { updateUser } from "../../store/slices/slotsSlice";
import { fetchUserWithRetry } from "../../common/function/getScaleTeams";
import { CardBody } from "../bootstrap/Card";
import { useFriendsData } from "../../hooks/useFriendsData";
import Icon from "../icon/Icon";
import Avatar from "../Avatar";
// import HeatMapBasic from "./HeatMap"

export const LoadFriendInformation = ({ setLoad, isPined, token = null, id }: { setLoad: any, isPined: boolean; token: any; id: number }) => {
    const [isFetched, setIsFetched] = useState(false);
    const [data, setData] = useState(null);
    const friendsData = useFriendsData({ id, token, setLoad });

    useEffect(() => {
        if (isFetched) return;
        setIsFetched(true);
        friendsData()
        .then(data => {
            setData(data);
        })
    }, [isFetched]);
    
    
    if (!data)
        return;

    console.log('data', data);

    return (
         <CardBody>
            <img style={{
                position: 'absolute',
    top: '80px',
    left: 'calc(50% - 100px / 2)',
    width: 100,
    height: 100,
    opacity: .1
                }} src={data?.coalitions[data.coalitions.length - 1].image_url}/>
            <Button
                icon="Link"
                style={{ margin: '15px 15px 30px 0', backgroundColor: data?.coalitions[data.coalitions.length - 1].color }}
                color="success"
                onClick={() => window.open(`https://profile.intra.42.fr/users/${id | 0}`, '_blank')}
            >
                Intra
            </Button>
            {/* <HeatMapBasic/> */}
            	<table>
					<thead className='table table-modern'>
						<tr>
							<th>project</th>
							<th>status</th>
                            <th>final_mark</th>
                            <th>retry</th>
						</tr>
					</thead>
					<tbody>
						{data?.projects_users.map((item) => (
							<tr key={item.id}>
								<td>{item.project.name}</td>
								<td>{item.status}</td>
                                <td>{item.final_mark}</td>
                                {item.occurrence  && <td>{item.occurrence}</td>}
							</tr>
						))}
					</tbody>
				</table>
         </CardBody>
    );
};
