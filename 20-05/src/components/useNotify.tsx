import { useToast } from '@chakra-ui/react';

export const useNotify = () => {
  const toast = useToast();

  const notify = (type, message) => {
    toast({
      title: message,
      status: type,
      duration: 3000,
      isClosable: true,
    });
  };

  return notify;
};
