import { MDXEditorMethods } from '@mdxeditor/editor';
import { FC } from 'react';
import MultipartDataForm from './MultipartDataForm';
import ProposalActionForm from './ProposalActionForm';

const OverlayForm: FC<{
  activeForm: string;
  onClose: () => void;
  editor?: MDXEditorMethods;
  setImagePayload?: (payload: any) => void;
  setLinkPayload?: (payload: any) => void;
  setProposalHashPayload?: (payload: any) => void;
}> = ({
  activeForm,
  onClose,
  editor,
  setImagePayload,
  setLinkPayload,
  setProposalHashPayload,
}) => {
  switch (activeForm) {
    case 'image':
      return (
        <MultipartDataForm
          activeForm="image"
          setImagePayload={setImagePayload}
          nullify={onClose}
          editor={editor}
        />
      );
    case 'link':
      return (
        <MultipartDataForm
          activeForm="link"
          setLinkPayload={setLinkPayload}
          nullify={onClose}
          editor={editor}
        />
      );
    case 'proposal':
      return (
        <ProposalActionForm
          nullify={onClose}
          editor={editor}
          setProposalHashPayload={setProposalHashPayload}
        />
      );
    default:
      return null;
  }
};

export default OverlayForm;
