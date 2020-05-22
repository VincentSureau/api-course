<?php

namespace App\EventSubscriber;

use App\Entity\User;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class PasswordEncoderSubscriber implements EventSubscriberInterface
{
    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => [
                'encodePassword', EventPriorities::PRE_WRITE,
            ]
        ];
    }

    public function encodePassword(ViewEvent $event)
    {
        $method = $event->getRequest()->getMethod();
        $user = $event->getControllerResult();
        if(!$user instanceOf User || $method != "POST")
        {   
            return;
        }

        $hash = $this->encoder->encodePassword($user, $user->getPassword());
        $user->setPassword($hash);
    }
}