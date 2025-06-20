import React, { useEffect, useState } from 'react';
import { useTour } from '@reactour/tour';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../components/bootstrap/Modal';
import Button from '../components/bootstrap/Button';
import Logo from '../components/Logo';
import Img from '../assets/img/wanna/susy/susy9.png';
import Icon from '../components/icon/Icon';
import { useRouter } from 'next/router';

const TourModal = () => {
	const router = useRouter();
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

	useEffect(() => {
		const timeout = setTimeout(() => setIsOpenModal(true), 3000);
		return () => {
			setIsOpenModal(false);
			clearTimeout(timeout);
		};
	}, []);

	const { setIsOpen } = useTour();

	return (
		<Modal isOpen={isOpenModal} setIsOpen={setIsOpenModal} titleId='tour-title'>
			<ModalHeader setIsOpen={setIsOpenModal}>
				<ModalTitle id='tour-title' className='d-flex align-items-end'>
					<Logo height={28} /> <span className='ps-2'>Assistant</span>
					<span className='ps-2'>
						<Icon icon='Verified' color='info' />
					</span>
				</ModalTitle>
			</ModalHeader>
			<ModalBody>
				<div className='row'>
					<div className='col-md-3'>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src={Img} alt='' width='100%' />
					</div>
					<div className='col-md-9 d-flex align-items-center'>
						<div>
							<h2>Hi 👋🏻, I'm Susy.</h2>
							<p className='lead'>#</p>
						</div>
					</div>
				</div>
			</ModalBody>
			<ModalFooter>
				<Button icon='Close' color='danger' isLink onClick={() => setIsOpenModal(false)}>
					No
				</Button>
				<Button
					icon='DoneOutline'
					color='success'
					isLight
					onClick={() => {
						setIsOpenModal(false);
						router.push('/');
						setTimeout(() => setIsOpen(true), 1000);
					}}>
					Yes
				</Button>
			</ModalFooter>
		</Modal>
	);
};

export default TourModal;
