import { useEffect, useState } from "react";
import Button from "../bootstrap/Button";
import { CardBody } from "../bootstrap/Card";
import { useFriendsData } from "../../hooks/useFriendsData"; 
import Collapse from "../bootstrap/Collapse";
import Spinner from "../bootstrap/Spinner";
import { CorrectorGrades, CorrectorLanguages } from "./CorrectorLanguages";
import Badge from "../bootstrap/Badge";
// import HeatMapBasic from "./HeatMap"

export const LoadFriendInformation = ({ color, languages, setColor, setLanguages, setLoad, isPined, token = null, id }: { setLoad: any, isPined: boolean; token: any; id: number }) => {
    const [isFetched, setIsFetched] = useState(false);
    const [data, setData] = useState();
    const friendsData = useFriendsData({ id, token, setLoad });
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isFetched || !isOpen || color || languages) return;
        setIsFetched(true);
        friendsData()
            .then(data => {
                setIsFetched(false);
                setData(data);
                setColor(data?.coalitions[data.coalitions.length - 1]?.color)
            })
    }, [color, languages, isFetched, isOpen]);

    return (
        <CardBody>
            {data?.coalitions && <img style={{
                position: 'absolute',
                top: 'calc(50% - 100px / 2)',
                left: 'calc(50% - 100px / 2)',
                width: 100,
                height: 100,
                opacity: .1
            }} src={data?.coalitions[data.coalitions.length - 1]?.image_url} />}
            <Button
                icon="Link"
                style={{ margin: '15px 15px 10px 0' }}
                color="success"
                onClick={() => window.open(`https://profile.intra.42.fr/users/${id | 0}`, '_blank')}
            >
            </Button>
            <Button
                icon="Download"
                style={{ margin: '15px 15px 10px 0', zIndex: 10, position: 'absolute' }}
                color="light"
                onClick={() => setIsOpen(!isOpen)}
            >Fetch
            </Button>
            {
                (!data && isOpen)
                    ? <div className="d-flex justify-content-center m-3">
                        <Spinner color="primary" />
                    </div>
                    : <Collapse
                        tag="div"
                        isOpen={isOpen}
                    >
                        {/* <HeatMapBasic/> */}
                        <Badge
                            style={{ marginRight: 10 }}
                            color='warning'
                        >{data?.user?.wallet}</Badge>
                        {data?.user && <CorrectorGrades id={id} users={[data?.user]} />}
                        {data?.user && setLanguages(<CorrectorLanguages id={id} users={[data?.user]} />)}
                        <table style={{ width: '100%' }} className="mt-4 mb-4">
                            <thead className='table table-modern'>
                                <tr>
                                    {/* <th>retry</th> */}
                                    <th>Project</th>
                                    <th>Mark</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.projects_users?.filter(i => !i["validated?"]).map((item) => (
                                    <tr key={item.id}>
                                        {/* <td>{item.occurrence ? item.occurrence : null}</td> */}
                                        <td>{item.project.name}</td>
                                        <td>{item.final_mark}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Button
                            color="dark"
                            isLight
                            onClick={() => setIsOpen(!isOpen)}
                            className="mb-3 w-100"
                        >
                            Hide projects
                        </Button>
                    </Collapse>
            }
        </CardBody>
    );
};
