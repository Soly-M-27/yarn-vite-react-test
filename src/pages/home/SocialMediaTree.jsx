import React, { useState } from 'react';
import { Tree, Input } from 'antd';
import { useProfileInfo } from '../../hooks/useProfileInfo';

const { TextArea } = Input;

const treeData = [
    {
        title: "Social Media's",
        key: '0-0',
        checkable: false,
        children: [
            { title: 'Facebook', key: '0-0-0' },
            { title: 'Twitter', key: '0-0-1' },
            { title: 'Instagram', key: '0-0-2' },
            { title: 'LinkedIn', key: '0-0-3' },
            { title: 'YouTube', key: '0-0-4' },
        ],
    },
];

export default function SocialMediaTree() {
    
    const { socialMediaLinks } = useProfileInfo();
    
    const [expandedKeys, setExpandedKeys] = useState(['Social Media']);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [autoExpandedParent, setAutoExpandedParent] = useState(true);
    const [linkInputs, setLinkInputs] = useState({});
    const [selectorError, setSelectorError] = useState(null);

    const onExpand = (expandedKeysValue) => {
        if (!expandedKeysValue) {
            console.log("No expandedKeysValue found: ", expandedKeysValue);
            setSelectorError("No expandedKeysValue found");
        }
        console.log('onExpand: ', expandedKeysValue);
        setExpandedKeys(expandedKeysValue);
        setAutoExpandedParent(false);
    };

    const onCheck = (checkedKeysValue) => {

        if (!checkedKeysValue) {
            console.log("No checkedKeysValue found: ", checkedKeysValue);
            setSelectorError("No checkedKeysValue found");
        }
        
        if (checkedKeysValue.length > 4) {
            return;
        }
        console.log('onCheck', checkedKeysValue);
        setCheckedKeys(checkedKeysValue);
    };

    const onSelect = (selectedKeysValue, info) => {
        if (!selectedKeysValue) {
            console.log("No selectedKeysValue found: ", selectedKeysValue);
            setSelectorError("No selectedKeysValue found");
        }
        if (!info) {
            console.log("No info found: ", info);
            setSelectorError("No info found");
        }
        console.log('onSelect', info);
        setSelectedKeys(selectedKeysValue);
    };

    const handleLinkChange = (key, e) => {

        if (!e && !key) {
            console.log("No e or key found: ", e, key);
            setSelectorError("No e or key found");
        }

        if (!e) {
            console.log("No e found: ", e);
            setSelectorError("No e found");
        }

        if (!key) {
            console.log("No key found: ", key);
            setSelectorError("No key found");
        }

        const { value } = e.target;
        
        setLinkInputs((prevState) => ({ ...prevState, [key]: value }));
        console.log("Social media links ready to be checked and sourced...");
        console.log("value: ", value);
        console.log("Links: ", linkInputs);
        socialMediaLinks(linkInputs);
    }

    return (
        <div>
            <Tree
                checkable
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandedParent}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                onSelect={onSelect}
                selectedKeys={selectedKeys}
                treeData={treeData}
            />
            {checkedKeys.length > 0 && (
                <div>
                    <h3>Enter Social Media Links:</h3>
                    {checkedKeys.map((key) => (
                        <div key={key}>
                            <span>{treeData[0].children.find(child => child.key === key).title}</span>
                            <TextArea
                                rows={1}
                                placeholder={`Enter link`}
                                value={linkInputs[key] || ''}
                                onChange={(e) => handleLinkChange(key, e)}
                            />
                        </div>
                    ))}
                </div>
            )}
            {selectorError && <p className='error'>{selectorError}</p>}
        </div>
    );
}