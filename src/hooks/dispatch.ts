import { createContext, Dispatch, useContext } from 'react';
import { ApplicationAction } from '../state/reducer';

export const DispatchContext = createContext((action: ApplicationAction): void => {});

export default function useDispatch(): Dispatch<ApplicationAction> {
    return useContext(DispatchContext);
}