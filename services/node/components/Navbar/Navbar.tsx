'use client';

import { useState } from 'react';
import {
    IconHome2,
    IconLogout,
    IconSettings,
    IconPhotoCirclePlus,
} from '@tabler/icons-react';
import { Group } from '@mantine/core';
import classes from './Navbar.module.css';

const data = [
    { link: '/', label: 'Orders', icon: IconHome2 },
    { link: '/create-order', label: 'Place Order', icon: IconPhotoCirclePlus },
    { link: '/settings', label: 'Settings', icon: IconSettings },
];

export function Navbar() {
    const [active, setActive] = useState('Billing');

    const links = data.map((item) => (
        <a
            className={classes.link}
            data-active={item.label === active || undefined}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                // event.preventDefault();
                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
    ));

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Group className={classes.header} justify="space-between">
                    Pixelfix
                </Group>
                {links}
            </div>

            <div className={classes.footer}>
                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>Logout</span>
                </a>
            </div>
        </nav>
    );
}