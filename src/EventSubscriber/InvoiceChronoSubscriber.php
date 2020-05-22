<?php

namespace App\EventSubscriber;

use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class InvoiceChronoSubscriber implements EventSubscriberInterface
{
    /**
     * @var InvoiceRepository
     */
    private $invoiceRepo;

    /**
     * @var Security
     */
    private $security;

    public function __construct(Security $security, InvoiceRepository $invoiceRepo)
    {
        $this->security = $security;
        $this->invoiceRepo = $invoiceRepo;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => [
                'setChronoForInvoice', EventPriorities::PRE_VALIDATE,
            ]
        ];
    }

    public function setChronoForInvoice(ViewEvent $event)
    {
        $method = $event->getRequest()->getMethod();
        $invoice = $event->getControllerResult();
        $user = $this->security->getUser();

        if(!$invoice instanceOf Invoice || $method != "POST" || empty($user))
        {   
            return;
        }

        $chrono = $this->invoiceRepo->findNextChrono($user);

        $invoice->setChrono($chrono);

        if(empty($invoice->getSentAt())){
            $invoice->setSentAt(new \DateTime("now"));
        }
    }
}