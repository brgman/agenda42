import { FC } from "react";
import OffCanvas, { OffCanvasHeader, OffCanvasTitle, OffCanvasBody } from "../bootstrap/OffCanvas";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { setModalStatus } from "../../store/slices/settingsReducer";
import FormGroup from "../bootstrap/forms/FormGroup";
import Button from "../bootstrap/Button";
import { useFormik } from "formik";
import Input from "../bootstrap/forms/Input";
import Icon from "../icon/Icon";
import showNotification from "../extras/showNotification";

const Settings: FC<any> = ({ settingsLoaded }: any) => {
    const settingsIsOpen = useSelector((state: RootState) => state.settings.settingsIsOpen);
    const me = useSelector((state: RootState) => state.user.me);

    const dispatch = useDispatch();

    const setSettings = (status: boolean) => {
        dispatch(setModalStatus(status));
    }

    const setDiscortId = (data: any) => {
        if (data?.data?.chat_id)
            return (data?.data?.chat_id)
        // return ("***" + settingsLoaded?.data?.chat_id.slice(settingsLoaded.data.chat_id.length - 5));
        else
            return ("");
    }

    // TODO: get user settings
    // if exist - method PATCH
    // else use   method POST

    const formik = useFormik({
        initialValues: {
            discordId: setDiscortId(settingsLoaded),
        },
        // validate,
        onSubmit: async (values) => { // (values, { resetForm })
            // TODO: save to SQLite3
            await fetch("/api/settings", {
                method: settingsLoaded?.data?.data ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: me.id,
                    chat_id: values.discordId, // 1150194983228412055 - abergman
                    view_default: "WEEK",
                    theme_default: "LIGHT"
                }),
            }).then(async (response) => {
                if (!response.ok) {
                    console.log(`Failed to create settings: ${response.statusText}`);
                    showNotification(
                        <span className="d-flex align-items-center">
                            <Icon icon="error" size="lg" className="me-1" />
                            <span>🐱 Settings not saved</span>
                        </span>, ""
                    );
                }
                showNotification(
                    <span className="d-flex align-items-center">
                        <Icon icon="success" size="lg" className="me-1" />
                        <span>🐱 Settings saved 🐱</span>
                    </span>, ""
                );
                return { success: true };
            })

            // resetForm({
            //     values: {
            //         todoTitle: '',
            //         todoBadges: '',
            //     },
            // });
        },
    });

    return (
        <OffCanvas
            setOpen={(status: boolean) => {
                setSettings(status);
            }}
            isOpen={settingsIsOpen}
            titleId="canvas-title"
        >
            <OffCanvasHeader
                setOpen={(status: boolean) => {
                    setSettings(status);
                }}
                className="p-4"
            >
                <OffCanvasTitle id="canvas-title">
                    Personal settings
                </OffCanvasTitle>
            </OffCanvasHeader>
            <OffCanvasBody
                tag="form"
                // onSubmit={formik.handleSubmit}
                className="p-4"
            >

                <div className='row'>
                    <div className='col-md-8'>

                        <div className='row g-4'>
                            <p>Notify with Bot Discord</p>
                            <FormGroup
                                className='col-12'
                                id='discordId'
                                label='Discord Chat ID'>
                                <Input
                                    onChange={formik.handleChange}
                                    value={formik.values.discordId}
                                />
                            </FormGroup>
                            <p>Default layout for main page</p>
                            <p>Default tab for main page</p>
                            <p>Default color theme</p>
                            {/* <FormGroup
                                        className='col-12'
                                        id='description'
                                        label='Description'>
                                        <Textarea
                                            onChange={formik.handleChange}
                                            value={formik.values.description}
                                        />
                                    </FormGroup> */}
                        </div>

                    </div>
                    {/* <div className='col-md-4'>
                        <div className='row g-4 sticky-top'>
                            <FormGroup className='col-12' id='groupId' label='Status'>
                                <Select
                                    ariaLabel='Board select'
                                    placeholder='Select group'
                                    onChange={formik.handleChange}
                                    value={formik.values.groupId}>
                                    {Object.keys(columnsData).map((columnItemKey) => (
                                        <Option
                                            key={columnsData[columnItemKey].id}
                                            value={columnsData[columnItemKey].id}>
                                            {columnsData[columnItemKey].title}
                                        </Option>
                                    ))}
                                </Select>
                            </FormGroup>
                            <FormGroup className='col-12' id='assignee' label='Assignee'>
                                <Select
                                    ariaLabel='Board select'
                                    placeholder='Select group'
                                    onChange={formik.handleChange}
                                    value={formik.values.assignee}>
                                    {Object.keys(USERS).map((u) => (
                                        // @ts-ignore
                                        <Option key={USERS[u].id} value={USERS[u].username}>
                                            {
                                                // @ts-ignore
                                                `${USERS[u].name} ${USERS[u].surname}`
                                            }
                                        </Option>
                                    ))}
                                </Select>
                            </FormGroup>
                            <FormGroup className='col-12' id='tags' label='Tags'>
                                <Select
                                    multiple
                                    ariaLabel='Board select'
                                    placeholder='Select group'
                                    onChange={formik.handleChange}
                                    value={formik.values.tags}>
                                    {Object.keys(TAGS).map((t) => (
                                        // @ts-ignore
                                        <Option key={TAGS[t].id} value={TAGS[t].id}>
                                            {
                                                // @ts-ignore
                                                TAGS[t].title
                                            }
                                        </Option>
                                    ))}
                                </Select>
                            </FormGroup>
                        </div>
                    </div> */}
                </div>

                <Button
                    color='primary'
                    className='w-100 mt-5'
                    type='submit'
                    onClick={formik.handleSubmit}>
                    Save
                </Button>

            </OffCanvasBody>
        </OffCanvas>
    )
};

export default Settings;