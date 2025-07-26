import React, { useState } from 'react';
import Modal, { ModalBody, ModalFooter } from './bootstrap/Modal';
import Button from './bootstrap/Button';
import Icon from './icon/Icon';
import { RootState } from '../store';
import { useSelector } from 'react-redux';
import { useRefreshAgenda } from '../hooks/useRefreshAgenda';

const GenderModal: React.FC = ({ token, setLoad }: any) => {
    const [update, setUpdate] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const me = useSelector((state: RootState) => state.user.me);
    const refreshAgenda = useRefreshAgenda({ me, token, setLoad });

    const addWavingHandHandler = async (gender: string) => {
        setUpdate(true);
        await fetch("/api/gender", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: me.id,
                gender: gender
            }),
        }).then(async (response) => {
            setUpdate(false);
            if (!response.ok) {
                console.log(`Failed to create settings: ${response.statusText}`);
            } else {
                setIsOpen(false);
                refreshAgenda();
                
            }
            return { success: true };
        })
    };

    return (
        <Modal
            id="example-modal"
            isStaticBackdrop
            titleId="example-title"
            setIsOpen={()=> {}}
            isOpen={isOpen}     
        >
            <Icon
                style={{ 
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    opacity: .1,
                 }}
                icon="WavingHand"
                // color={darkModeStatus ? 'light' : 'dark'}
                size="10x"
            />
            <ModalBody>
                <p className="h4 m-5">
                    To provide you with the most relevant events and a personalized experience, please indicate your gender.
                    </p>
                <p className="h4 m-5">
                    Your privacy is important to us, and this information will only be used to customize content.
                </p>
            </ModalBody>
            <ModalFooter style={{ justifyContent: 'space-around', marginBottom: 10 }}>
                <Button
                    color="dark"
                    onClick={() => addWavingHandHandler("F")}
                    isDisable={update}
                >
                    Female
                </Button>
                <Button
                    color="dark"
                    onClick={() => addWavingHandHandler("M")}
                    isDisable={update}
                >
                    Male
                </Button>
                <Button
                    color="light"
                    onClick={() => addWavingHandHandler("O")}
                    isDisable={update}
                >
                    Other / Prefer not to say
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default GenderModal;